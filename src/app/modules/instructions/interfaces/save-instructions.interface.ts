export interface IInstructionsSave {
    id?: number | null;
    active: boolean | number;
    name: string;
    url: string;
    user_id: number | null;
    created_at?: Date;
    updated_at?: Date;
  }