
export type UserState = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    role: Role;
  };

export type AuthState = {
    user?: UserState; 
    token?: string;
};
  

enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}