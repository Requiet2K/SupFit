import { CartItem } from "../../types/cartType";
import { apiSlice } from "../api/apiSlice"

export const checkoutApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCurrentOrders: builder.query({
            query: id => {
                return `/api/v1/checkouts/currentOrders/${id}`;
            }
        }),
        getPastOrders: builder.query({
            query: id => {
                return `/api/v1/checkouts/pastOrders/${id}`;
            }
        }),
        createCheckout: builder.mutation({
            query: ({userId, products, price, addressId}: {userId: number, products: CartItem[], price: number, addressId: number}) => ({
                url: `/api/v1/checkouts/${userId}?price=${price}&addressId=${addressId}`,
                method: 'POST',          
                body: products
            })
        }),
        getTotalOrderOfUserCount: builder.query({
            query: id => {
                return `/api/v1/checkouts/totalOrder/${id}`;
            }
        }),
        isProductDelivered: builder.query({
            query: ({userId, productId}: {userId: number, productId: number}) => {
                return `/api/v1/checkouts/isDelivered?userId=${userId}&productId=${productId}`;
            }
        }),
        bestSellers: builder.query({
            query: () => {
                return "/api/v1/checkouts/bestSellers";
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