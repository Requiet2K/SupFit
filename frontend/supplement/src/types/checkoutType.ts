import { ProductState } from "./productType";
import { AddressState } from "./userTypes";

export type CheckoutState = {
    id: number;
    checkoutDate: Date;
    deliveryDate: Date;
    price: number;
    address: AddressState;
    products: CheckoutProductState[];
};

export type CheckoutProductState = {
    product: ProductState;
    quantity: number;
}