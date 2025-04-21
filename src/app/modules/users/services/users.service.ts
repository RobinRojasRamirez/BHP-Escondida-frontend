import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IParamsTable } from '../../../shared/interfaces/params-table.interface';
import { IResponseTableApi } from '../../../shared/interfaces/response-table-api.interface';
import { IResponseApi } from '../../../shared/interfaces/response.interface';
import { IUsersSave } from '../interfaces/users-save.interface';
import { IUsersResponse } from '../interfaces/response-save-users.interface';
import { IUsersGetId } from '../interfaces/get-id-users.interface';
import { ITableUsers } from '../interfaces/table-users.interface';
import { IListsRolesResponse } from '../interfaces/response-lists-roles.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  API_URL = environment.apiUrl

  constructor(private readonly _httpClient: HttpClient) { }

  // Obtener datos para datatable usuarios
  getUsersTable(iFilterTable: IParamsTable<null>): Observable<IResponseTableApi<ITableUsers>> {
    return this._httpClient.post<IResponseTableApi<ITableUsers>>(`${this.API_URL}/users/table`, iFilterTable);
  }

  getListsRoles(): Observable<IResponseTableApi<IListsRolesResponse>>{
    return this._httpClient.get<IResponseTableApi<IListsRolesResponse>>(`${this.API_URL}/lists-roles/`);
  }

  createUser(user: IUsersSave): Observable<IResponseTableApi<IUsersResponse>> {
    return this._httpClient.post<IResponseTableApi<IUsersResponse>>(`${this.API_URL}/save-user`, user);
  }

  getUserId(id: number | null): Observable<IResponseApi<IUsersGetId>> {
    return this._httpClient.get<IResponseApi<IUsersGetId>>(`${this.API_URL}/users/${id}`);
  }

  deleteUser(id: number | null): Observable<IResponseApi<null>> {
    return this._httpClient.delete<IResponseApi<null>>(`${this.API_URL}/users/${id}`);
  }

}
