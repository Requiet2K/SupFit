import { apiSlice } from "../api/apiSlice"

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProductsByCategory: builder.query({
            query: id => {
                return `/products/findByCategoryId/${id}`;
            }
        }),
        getAllProductsName: builder.query({
            query: () => {
                return `/products/getAllNames`;
            }
        }),
        findProductByPathName: builder.query({
            query: name => {
                return `/products/findByPathName/${name}`;
            }
        }),
        getProductById: builder.query({
            query: id => {
                return `/products/${id}`;
            }
        }),
        getProductsByInput: builder.query({
            query: name => {
                return `/products/findByInput/${name}`
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