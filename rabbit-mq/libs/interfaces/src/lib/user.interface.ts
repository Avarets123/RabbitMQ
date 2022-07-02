export enum UserRole {
    Teacher = 'Teacher',
    Students = 'Student'
}

export interface IUser {
    _id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
}