
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
        })
    })
})

export const {
    useUpdateUserMutation,
    useUpdatePasswordMutation,
    useLazyGetUserQuery
} = userApiSlice;