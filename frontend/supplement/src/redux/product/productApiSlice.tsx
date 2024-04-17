import { apiSlice } from "../api/apiSlice"

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProductsByCategory: builder.query({
            query: id => {
                return `/product/getProductsByCategory/${id}`;
            }
        }),
    })
})

export const {
    useGetProductsByCategoryQuery
} = productApiSlice;