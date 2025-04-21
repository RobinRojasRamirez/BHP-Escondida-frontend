import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IParamsTable } from '../../../shared/interfaces/params-table.interface';
import { IResponseTableApi } from '../../../shared/interfaces/response-table-api.interface';
import { IInstructionsSave } from '../interfaces/save-instructions.interface';
import { IInstructionsResponse } from '../interfaces/response-save-instructions.interface';
import { ITableInstructions } from '../interfaces/table-instructions.interface';
import { IInstructionGetId } from '../interfaces/get-id-instructions.interface';
import { IResponseApi } from '../../../shared/interfaces/response.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstructionsService {

  API_URL = environment.apiUrl

  constructor(private readonly _httpClient: HttpClient) { }

  // Obtener datos para datatable instructivos
  getInstructionsTable(iFilterTable: IParamsTable<null>): Observable<IResponseTableApi<ITableInstructions>> {
    return this._httpClient.post<IResponseTableApi<ITableInstructions>>(`${this.API_URL}/instructions/table`, iFilterTable);
  }
  createInstruction(instruction: IInstructionsSave): Observable<IResponseTableApi<IInstructionsResponse>> {
    return this._httpClient.post<IResponseTableApi<IInstructionsResponse>>(`${this.API_URL}/save-instruction`, instruction);
  }

  getInstructionId(id: number | null): Observable<IResponseApi<IInstructionGetId>> {
    return this._httpClient.get<IResponseApi<IInstructionGetId>>(`${this.API_URL}/instruction/${id}`);
  }

  deleteInstruction(id: number | null): Observable<IResponseApi<null>> {
    return this._httpClient.delete<IResponseApi<null>>(`${this.API_URL}/instruction/${id}`);
  }

}
