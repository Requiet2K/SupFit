import { changePasswordState, updateUserState } from "../../types/userTypes";
import { apiSlice } from "../api/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updateUser: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: updateUserState }) => ({
                url: `/api/v1/users/update/${id}`,
                method: 'PUT',
                body: {...credentials}                
            })
        }),
        updatePassword: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: changePasswordState }) => ({
                url: `/api/v1/users/changePassword/${id}`,
                method: 'PUT',
                body: {...credentials}
            })
        }),
        getUser: builder.query({
            query: id => {
                return `/api/v1/users/getById/${id}`;
            }
        }),
        getTokenValidation: builder.query({
            query: id => {
                return `/api/v1/users/getTokenValidation/${id}`;
            }
        }),
        updateTokenValidation: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: number }) => ({
                url: `/api/v1/users/updateTokenValidation/${id}`,
                method: 'PUT',
                body: JSON.stringify(credentials), 
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }),
        getUserId: builder.query({
            query: email => {
                return `/api/v1/users/findIdByEmail/${email}`;
            }
        }),
        changeUserPassword: builder.mutation({
            query: ({ id, newPassword } : { id: number, newPassword: string }) => ({
                url: `/api/v1/users/forgetPassword/${id}`,
                method: 'PUT',
                body: newPassword
            })
        }),
        addFavoriteProduct: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: number }) => ({
                url: `/api/v1/users/addFavorite/${id}?productId=${credentials}`,
                method: 'PUT',
            })
        }),
        removeFavoriteProduct: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: number }) => ({
                url: `/api/v1/users/removeFavorite/${id}?productId=${credentials}`,
                method: 'PUT',
            })
        }),
    })
})

export const {
    useUpdateUserMutation,
    useUpdatePasswordMutation,
    useLazyGetUserQuery,
    useLazyGetTokenValidationQuery,
    useUpdateTokenValidationMutation,
    useLazyGetUserIdQuery,
    useChangeUserPasswordMutation,
    useAddFavoriteProductMutation,
    useRemoveFavoriteProductMutation
} = userApiSlice;