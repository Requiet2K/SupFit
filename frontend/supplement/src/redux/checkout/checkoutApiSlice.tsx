import { CartItem } from "../../types/cartType";
import { apiSlice } from "../api/apiSlice"

export const checkoutApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCurrentOrders: builder.query({
            query: id => {
                return `/checkouts/currentOrders/${id}`;
            }
        }),
        getPastOrders: builder.query({
            query: id => {
                return `/checkouts/pastOrders/${id}`;
            }
        }),
        createCheckout: builder.mutation({
            query: ({userId, products, price, addressId}: {userId: number, products: CartItem[], price: number, addressId: number}) => ({
                url: `/checkouts/${userId}?price=${price}&addressId=${addressId}`,
                method: 'POST',          
                body: products
            })
        }),
        getTotalOrderOfUserCount: builder.query({
            query: id => {
                return `/checkouts/totalOrder/${id}`;
            }
        }),
        isProductDelivered: builder.query({
            query: ({userId, productId}: {userId: number, productId: number}) => {
                return `/checkouts/isDelivered?userId=${userId}&productId=${productId}`;
            }
        }),
        bestSellers: builder.query({
            query: () => {
                return "/checkouts/bestSellers";
            }
        }),
    })
})

export const {
    useCreateCheckoutMutation,
    useLazyGetCurrentOrdersQuery,
    useLazyGetPastOrdersQuery,
    useLazyGetTotalOrderOfUserCountQuery,
    useLazyIsProductDeliveredQuery,
    useLazyBestSellersQuery
} = checkoutApiSlice;