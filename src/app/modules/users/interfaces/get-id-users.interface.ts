export interface IRoleUsers {
    id: number,
    name?: string
}
  
export interface IUsersGetId {
    id?: number;
    name: string;
    email: string;
    active: number | boolean;
    created_at: string;
    updated_at: string;
    email_verified_at: string | null;
    roles: IRoleUsers[];
}