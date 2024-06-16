import { apiSlice } from "../api/apiSlice"

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProductsByCategory: builder.query({
            query: id => {
                return `/api/v1/products/findByCategoryId/${id}`;
            }
        }),
        getAllProductsName: builder.query({
            query: () => {
                return `/api/v1/products/allNames`;
            }
        }),
        findProductByPathName: builder.query({
            query: name => {
                return `/api/v1/products/findByPathName/${name}`;
            }
        }),
        getProductById: builder.query({
            query: id => {
                return `/api/v1/products/${id}`;
            }
        }),
        getProductsByInput: builder.query({
            query: name => {
                return `/api/v1/products/findByInput/${name}`
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