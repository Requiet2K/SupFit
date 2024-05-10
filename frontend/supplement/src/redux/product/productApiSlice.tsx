import { apiSlice } from "../api/apiSlice"

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProductsByCategory: builder.query({
            query: id => {
                return `/product/getProductsByCategory/${id}`;
            }
        }),
        getAllProductsName: builder.query({
            query: () => {
                return `/product/getAllProductsName`;
            }
        }),
        findProductByPathName: builder.query({
            query: name => {
                return `/product/findProductByPathName/${name}`;
            }
        }),
        getProductById: builder.query({
            query: id => {
                return `/product/getProductById/${id}`;
            }
        }),
    })
})

export const {
    useLazyGetProductsByCategoryQuery,
    useLazyGetAllProductsNameQuery,
    useLazyFindProductByPathNameQuery,
    useLazyGetProductByIdQuery
} = productApiSlice;