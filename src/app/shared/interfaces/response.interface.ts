export interface IResponseApi<T> {
  status: number;
  statusCode: number;
  message: string;
  data: T;
  error: boolean;
}
