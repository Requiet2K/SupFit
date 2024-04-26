import { apiSlice } from "../api/apiSlice"

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getItems: builder.query({
            query: userId => {
                return `/cart/getItems/${userId}`;
            }
        }),
        addToCart: builder.mutation({
            query: ({ userId, productId, quantity } : { userId: number, productId: number, quantity: number }) => ({
                url: `cart/addToCart/${userId}?productId=${productId}?quantity=${quantity}`,
                method: 'PUT',
            })
        }),
        removeFromCart: builder.mutation({
            query: ({ userId, productId, quantity }: { userId: number, productId: number, quantity: number }) => ({
                url: `/cart/removeFromCart/${userId}?productId=${productId}?quantity=${quantity}`,
                method: 'PUT',
            })
        }),
        emptyCart: builder.mutation({
            query: ({ userId }: { userId: number }) => ({
                url: `/cart/emptyCart/${userId}`,
                method: 'PUT',
            })
        }),
    })
})

export const {
    useLazyGetItemsQuery,
    useAddToCartMutation,
    useEmptyCartMutation,
    useRemoveFromCartMutation
} = cartApiSlice;