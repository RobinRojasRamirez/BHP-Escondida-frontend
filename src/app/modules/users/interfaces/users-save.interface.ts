export interface IUsersSave {
    id?: number | null;
    active: boolean | number;
    name: string;
    email: string;
    role: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
}