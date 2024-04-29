import { ProductState } from "../../types/productType";
import { apiSlice } from "../api/apiSlice"

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getItems: builder.query({
            query: userId => {
                return `/cart/getItems/${userId}`;
            }
        }),
        addToCart: builder.mutation({
            query: ({ userId, product, quantity }: { userId: number, product: ProductState, quantity: number }) => ({
            url: `/cart/addToCart/${userId}?quantity=${quantity}`,
            method: 'PUT',
            body: product
            })
        }),
        removeFromCart: builder.mutation({
            query: ({ userId, product }: { userId: number, product: ProductState }) => ({
            url: `/cart/removeFromCart/${userId}`,
            method: 'DELETE',
            body: product
            })
        }),
        increaseCartItem: builder.mutation({
            query: ({ userId, product, quantity }: { userId: number, product: ProductState, quantity: number }) => ({
                url: `/cart/increaseCartItem/${userId}?quantity=${quantity}`,
                method: 'POST',
                body: product
            })
        }),
        decreaseCartItem: builder.mutation({
            query: ({ userId, product, quantity }: { userId: number, product: ProductState, quantity: number }) => ({
                url: `/cart/decreaseCartItem/${userId}?quantity=${quantity}`,
                method: 'POST',
                body: product
            })
        }),
        clearCart: builder.mutation({
            query: ({ userId }: { userId: number }) => ({
                url: `/cart/clearCart/${userId}`,
                method: 'DELETE',
            })
        }),
        handleUpdateQuantity: builder.mutation({
            query: ({ userId, product, quantity }: { userId: number, product: ProductState, quantity: number }) => ({
                url: `/cart/handleUpdateQuantity/${userId}?quantity=${quantity}`,
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