
export type UserState = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender?: string,
    birthDate?: Date | null,
    phoneNumber?: string,
    addresses?: AddressState[];
    role: Role;
};

export type AddressState = {
    id: number;
    default: boolean;
    title: string;
    recipientFirstName: string;
    recipientLastName: string;
    recipientPhoneNumber: string;
    country: string;
    city: string;
    district: string;
    address: string;
}

export type sendAddressState = {
    default: boolean;
    title: string;
    recipientFirstName: string;
    recipientLastName: string;
    recipientPhoneNumber: string;
    country: string;
    city: string;
    district: string;
    address: string;
}

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