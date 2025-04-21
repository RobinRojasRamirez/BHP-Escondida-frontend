export interface IParamsTable<T> {
  page: number;
  row: number;
  size?: number;
  search?: string | string[] | null;
  order_by?: string | string[] | null;
  title?: string;
  order?: string | string[] | null;
  params?: T | T[] | null;
}
