import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Cambia esto a tu backend

  constructor(private http: HttpClient, private router: Router) {}

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }

  // Método para obtener el token almacenado en localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para almacenar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Método para cerrar sesión (remover el token)
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']); // Redirigir a login
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Método para obtener los headers con el token de autenticación
  getAuthHeaders() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    };
  }
}