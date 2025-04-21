export interface IInstructionGetId {
    id: number;
    name: string;
    email: string;
    active: number | boolean;
    created_at: string;
    updated_at: string;
    email_verified_at: string | null;
}