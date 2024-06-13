import { changePasswordState, updateUserState } from "../../types/userTypes";
import { apiSlice } from "../api/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updateUser: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: updateUserState }) => ({
                url: `/user/save/${id}`,
                method: 'PUT',
                body: {...credentials}                
            })
        }),
        updatePassword: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: changePasswordState }) => ({
                url: `/user/changePass/${id}`,
                method: 'PUT',
                body: {...credentials}
            })
        }),
        getUser: builder.query({
            query: id => {
                return `/user/getUserById/${id}`;
            }
        }),
        getTokenValidation: builder.query({
            query: id => {
                return `/user/tokenValidation/${id}`;
            }
        }),
        updateTokenValidation: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: number }) => ({
                url: `/user/changeTokenValidation/${id}`,
                method: 'PUT',
                body: JSON.stringify(credentials), 
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }),
        getUserId: builder.query({
            query: email => {
                return `/user/findUserIdByEmail/${email}`;
            }
        }),
        changeUserPassword: builder.mutation({
            query: ({ id, newPassword } : { id: number, newPassword: string }) => ({
                url: `user/forgetPass/${id}`,
                method: 'PUT',
                body: newPassword
            })
        }),
        addFavoriteProduct: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: number }) => ({
                url: `/user/addFavs/${id}?productId=${credentials}`,
                method: 'PUT',
            })
        }),
        removeFavoriteProduct: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: number }) => ({
                url: `/user/removeFavs/${id}?productId=${credentials}`,
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