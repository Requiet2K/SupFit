import { changePasswordState, updateUserState } from "../../types/userTypes";
import { apiSlice } from "../api/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updateUser: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: updateUserState }) => ({
                url: `/user/updateUser/${id}`,
                method: 'PUT',
                body: {...credentials}                
            })
        }),
        updatePassword: builder.mutation({
            query: ({ id, credentials }: { id: number, credentials: changePasswordState }) => ({
                url: `/user/updatePassword/${id}`,
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
                url: `/user/updateTokenValidation/${id}`,
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
            query: ({ id, newPass } : { id: number, newPass: string }) => ({
                url: `user/changeUserPassword/${id}`,
                method: 'PUT',
                body: {newPass}
            })
        })
    })
})

export const {
    useUpdateUserMutation,
    useUpdatePasswordMutation,
    useLazyGetUserQuery,
    useLazyGetTokenValidationQuery,
    useUpdateTokenValidationMutation,
    useLazyGetUserIdQuery,
    useChangeUserPasswordMutation
} = userApiSlice;