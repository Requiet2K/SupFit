import { ProductState } from "./productType";

export type CheckoutState = {
    id: number;
    checkoutDate: Date;
    deliveryDate: Date;
    price: number;
    addressDetails: AddressDetails;
    products: CheckoutProductState[];
};

export type CheckoutProductState = {
    product: ProductState;
    quantity: number;
}

export type AddressDetails = {
    title: string;
    recipientFirstName: string;
    recipientLastName: string;
    recipientPhoneNumber: string;
    country: string;
    city: string;
    district: string;
    address: string;
}