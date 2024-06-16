import { ProductState } from "../../types/productType";
import { apiSlice } from "../api/apiSlice"

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getItems: builder.query({
            query: userId => {
                return `/api/v1/carts/${userId}`;
            }
        }),
        addToCart: builder.mutation({
            query: ({ userId, product, quantity }: { userId: number, product: ProductState, quantity: number }) => ({
            url: `/api/v1/carts/addToCart/${userId}?quantity=${quantity}`,
            method: 'PUT',
            body: product
            })
        }),
        removeFromCart: builder.mutation({
            query: ({ userId, product }: { userId: number, product: ProductState }) => ({
            url: `/api/v1/carts/removeFromCart/${userId}`,
            method: 'DELETE',
            body: product
            })
        }),
        increaseCartItem: builder.mutation({
            query: ({ userId, product, quantity }: { userId: number, product: ProductState, quantity: number }) => ({
                url: `/api/v1/carts/increaseCartItem/${userId}?quantity=${quantity}`,
                method: 'POST',
                body: product
            })
        }),
        decreaseCartItem: builder.mutation({
            query: ({ userId, product, quantity }: { userId: number, product: ProductState, quantity: number }) => ({
                url: `/api/v1/carts/decreaseCartItem/${userId}?quantity=${quantity}`,
                method: 'POST',
                body: product
            })
        }),
        clearCart: builder.mutation({
            query: ({ userId }: { userId: number }) => ({
                url: `/api/v1/carts/clearCart/${userId}`,
                method: 'DELETE',
            })
        }),
        handleUpdateQuantity: builder.mutation({
            query: ({ userId, product, quantity }: { userId: number, product: ProductState, quantity: number }) => ({
                url: `/api/v1/carts/handleUpdateQuantity/${userId}?quantity=${quantity}`,
                method: 'PUT',
                body: product
            })
        })
    })
})

export const {
    useLazyGetItemsQuery,
    useAddToCartMutation,
    useDecreaseCartItemMutation,
    useIncreaseCartItemMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
    useHandleUpdateQuantityMutation
} = cartApiSlice;