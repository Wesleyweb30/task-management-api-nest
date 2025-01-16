export class TaskDto {
    id?: string;
    title: string;
    description?: string;
    status: string;
    expirationDate: Date;
    userId?: string;
}

export interface FindAllParameters {
    title: string;
    status: string;
}