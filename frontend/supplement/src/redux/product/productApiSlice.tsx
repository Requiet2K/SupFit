import { apiSlice } from "../api/apiSlice"

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProductsByCategory: builder.query({
            query: id => {
                return `/products/getProductsByCategory/${id}`;
            }
        }),
        getAllProductsName: builder.query({
            query: () => {
                return `/products/getAllProductsName`;
            }
        }),
        findProductByPathName: builder.query({
            query: name => {
                return `/products/findProductByPathName/${name}`;
            }
        }),
        getProductById: builder.query({
            query: id => {
                return `/products/getProductById/${id}`;
            }
        }),
        getProductsByInput: builder.query({
            query: name => {
                return `/products/getProductsByInput/${name}`
            }
        })
    })
})

export const {
    useLazyGetProductsByCategoryQuery,
    useLazyGetAllProductsNameQuery,
    useLazyFindProductByPathNameQuery,
    useLazyGetProductByIdQuery,
    useLazyGetProductsByInputQuery
} = productApiSlice;