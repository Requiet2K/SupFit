
import { changePasswordState, updateUserState } from "../../types/loginTypes";
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
        })
    })
})

export const {
    useUpdateUserMutation,
    useUpdatePasswordMutation,
    useLazyGetUserQuery,
    useLazyGetTokenValidationQuery,
    useUpdateTokenValidationMutation
} = userApiSlice;