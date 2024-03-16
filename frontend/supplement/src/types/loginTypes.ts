
export type UserState = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender?: string,
    birthDate?: Date | null,
    phoneNumber?: string,
    address?: string;
    role: Role;
  };

export type AuthState = {
    user?: UserState; 
    token?: string;
};

export type updateUserState = {
    birthDate?: Date | null,
    phoneNumber?: string,
    gender?: string
}

export type changePasswordState = {
    currentPassword: string,
    newPassword: string,
}


enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}