import { ProductState } from "./productType";

export type CartItem = {
    id: number;
    quantity: number;
    product: ProductState;
};

export type CartState = {
    items: CartItem[];
};

