import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IDBPDatabase, openDB } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private API_URL_BASE =  environment.apiUrl 
  private dbPromise: Promise<IDBPDatabase>

  constructor(private readonly _httpClient: HttpClient) { 
    this.dbPromise = this.initializeDB()
  }

  login(login: object): Observable<any> {
    return new Observable(observer => {
      this._httpClient.post(`${this.API_URL_BASE}/login`, login).subscribe({
        next: async (response: any) => {
          if (response.data.access_token) {
            const token = response.data.access_token;
            await this.storeUserDatToken(token).then(() => {
            // Ahora obtenemos los datos del usuario
            this.getUser().then(userObservable => userObservable.subscribe({
              next: async (responseUser) => {
                await this.storeUserData(responseUser.data);
                observer.next({ token, responseUser });
                observer.complete();
              },
              error: err => observer.error(err)
            }));
          })
          } else {
            observer.error('No se recibió un token válido.');
          }
        },
        error: err => observer.error(err)
      });
    });
  }

   // Guardar token y usuario en IndexedDB
   private async storeUserData(user: any) {
    const db = await this.dbPromise; 

    try {
      // Guardar usuario en `user`
      const txUser = db.transaction('user', 'readwrite');
      const storeUser = txUser.objectStore('user');
      await storeUser.put({ id: 1, userData: user });
      await txUser.done;

      console.log("Usuario y token almacenados correctamente en IndexedDB.");
    } catch (error) {
      console.error("Error al guardar datos en IndexedDB:", error);
    }
  }

  async getUser(): Promise<Observable<any>> {
    const token = await this.getToken();
    
    if (!token) {
      console.error("No se encontró un token válido.");
      return new Observable(observer => observer.error("No autenticado."));
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this._httpClient.get(`${this.API_URL_BASE}/me`, { headers });
  }

  // Guardar token y usuario en IndexedDB
  private async storeUserDatToken(token: string) {
    const db = await this.dbPromise; 

    try {
      // 🟢 Guardar token en `auth_token`
      const txToken = db.transaction('auth_token', 'readwrite');
      const storeToken = txToken.objectStore('auth_token');
      await storeToken.put({ id: 1, token });
      await txToken.done;
      console.log("Token almacenado correctamente en IndexedDB.", token);
      console.log("Usuario y token almacenados correctamente en IndexedDB.");
    } catch (error) {
      console.error("Error al guardar datos en IndexedDB:", error);
    }
  }

   // 🟢 Inicializar IndexedDB con dos objectStores: `user` y `auth_token`
   public async initializeDB(): Promise<IDBPDatabase> {
    const db = await openDB('smart-ticket-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('user')) {
          console.log("Creando IndexedDB 'user' store...");
          db.createObjectStore('user', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('auth_token')) {
          console.log("Creando IndexedDB 'auth_token' store...");
          db.createObjectStore('auth_token', { keyPath: 'id' });
        }
      }
    }).catch(error => {
      console.error("Error al inicializar IndexedDB:", error);
      return undefined;
    });

    if (!db) {
      throw new Error("Failed to initialize IndexedDB");
    }

    return db;
  }

  async getToken(): Promise<string | null> {
    try {
      const db = await this.dbPromise;
      const tokenData = await db.get('auth_token', 1);
      return tokenData?.token || null;
    } catch (error) {
      console.error('Error al acceder al token en IndexedDB:', error);
      return null;
    }
  }

  // 🟢 Obtener usuario almacenado en IndexedDB
  async getStoredUser(): Promise<any | null> {
    try {
      const db = await this.dbPromise;
      return await db.get('user', 1);
    } catch (error) {
      console.error('Error al acceder a IndexedDB:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const auth = await this.getStoredUser()
      if (!auth) {
        return false
      }
      const token = auth.userData.token
      return !this.isTokenExpired(token ? token : '')
    } catch (error) {
      this.logout() // Ejecutar logout en caso de error
      return false
    }
  }

  // 🟢 Verificar si el token ha expirado
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar token JWT
      const expiration = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() >= expiration;
    } catch (error) {
      return true; // Si hay un error, asumimos que el token es inválido o expirado
    }
  }

  // 🟢 Cerrar sesión: Elimina el usuario y el token de IndexedDB
  async logout(): Promise<void> {
    try {
      const db = await this.dbPromise;
      const tokenData = await db.get('auth_token', 1);

      if (tokenData?.token) {
        const headers = new HttpHeaders({ Authorization: `Bearer ${tokenData.token}` });

        // 🟢 Llamar a la API para invalidar el token en el backend
        await this._httpClient.post(`${this.API_URL_BASE}/logout`, {}, { headers }).toPromise();
      }
    } catch (error) {
      console.error('Error al cerrar sesión en el backend:', error);
    } finally {
      // 🔹 Siempre eliminar datos de IndexedDB, incluso si la API falla
      await this.deletedIndexedDB()
    }
  }

  async deletedIndexedDB(): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('user', 1);
    await db.delete('auth_token', 1);
  }

}
