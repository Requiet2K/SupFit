import { CartItem } from "../../types/cartType";
import { apiSlice } from "../api/apiSlice"

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getItems: builder.query({
            query: userId => {
                return `/cart/getItems/${userId}`;
            }
        }),
        updateCart: builder.mutation({
            query: ({ userId, cartItems }: { userId: number, cartItems: CartItem[] }) => ({
                url: `/cart/updateCart/${userId}`,
                method: 'POST',
                body: cartItems
            })
        }),
    })
})

export const {
    useLazyGetItemsQuery,
    useUpdateCartMutation
} = cartApiSlice;