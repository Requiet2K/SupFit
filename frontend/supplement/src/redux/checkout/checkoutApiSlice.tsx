import { CartItem } from "../../types/cartType";
import { apiSlice } from "../api/apiSlice"

export const checkoutApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCurrentOrders: builder.query({
            query: id => {
                return `/checkout/getCurrentOrders/${id}`;
            }
        }),
        getPastOrders: builder.query({
            query: id => {
                return `/checkout/getPastOrders/${id}`;
            }
        }),
        createCheckout: builder.mutation({
            query: ({userId, products, price, addressId}: {userId: number, products: CartItem[], price: number, addressId: number}) => ({
                url: `/checkout/createCheckout/${userId}?price=${price}&addressId=${addressId}`,
                method: 'POST',          
                body: products
            })
        }),
        getTotalOrderOfUserCount: builder.query({
            query: id => {
                return `/checkout/getTotalOrderOfUserCount/${id}`;
            }
        }),
        isProductDelivered: builder.query({
            query: ({userId, productId}: {userId: number, productId: number}) => {
                return `/checkout/isProductDelivered?userId=${userId}&productId=${productId}`;
            }
        }),
    })
})

export const {
    useCreateCheckoutMutation,
    useLazyGetCurrentOrdersQuery,
    useLazyGetPastOrdersQuery,
    useLazyGetTotalOrderOfUserCountQuery,
    useLazyIsProductDeliveredQuery
} = checkoutApiSlice;