import { apiSlice } from "../api/apiSlice"

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findCategoryIdByName: builder.query({
            query: name => {
                return `/categories/findCategoryIdByName/${name}`;
            }
        }),
    })
})

export const {
    useLazyFindCategoryIdByNameQuery
} = categoryApiSlice;