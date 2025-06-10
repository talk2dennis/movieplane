export interface IUser {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    token?: string;
    isAdmin?: boolean;
    isAuthenticated?: boolean;
    profilePicture?: string;
}