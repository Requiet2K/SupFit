import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { CartState } from "../../types/cartType";
import { ProductState } from "../../types/productType";

const initialState: CartState = {
    items: JSON.parse(localStorage.getItem('cart') || '[]'),
};
  

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{product: ProductState, quantity: number}>) => {
            const { product, quantity } = action.payload;
            const existingItem = state.items.find(item => item.product.id === product.id);
  
            if (existingItem) {
                if(existingItem.quantity + quantity <= product.quantity){
                    existingItem.quantity += quantity;
                }else{
                    existingItem.quantity = product.quantity;
                }
            } else {
                state.items.push({ id: product.id, quantity, product });
            }

            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeFromCart: (state, action: PayloadAction<{product: ProductState, quantity: number}>) => {
            const { product, quantity } = action.payload;
            const existingItem = state.items.find(item => item.product.id === product.id);
            const index = state.items.findIndex(item => item.product.id === product.id);

            if (existingItem) {
                if (existingItem.quantity <= quantity) {
                    state.items.splice(index, 1);
                } else {
                    existingItem.quantity -= quantity;
                }
            }

            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeAllFromCart: (state) => {
            state.items = [];
            localStorage.removeItem('cart');
        },
        updateQuantityInCart: (state, action: PayloadAction<{product: ProductState, quantity: number}>) => {
            const { product, quantity } = action.payload;
            const item = state.items.find(item => item.product.id === product.id);

            if (item) {
                item.quantity = quantity;
            }

            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeItemFromCart: (state, action: PayloadAction<{product: ProductState}>) => {
            const { product } = action.payload;
            const index = state.items.findIndex(item => item.product.id === product.id);

            if (index !== -1) {
                state.items.splice(index, 1);
            }

            localStorage.setItem('cart', JSON.stringify(state.items));
        },
    }
});

export const { addToCart, removeFromCart, removeAllFromCart, updateQuantityInCart, removeItemFromCart } = cartSlice.actions;

export default cartSlice.reducer;

