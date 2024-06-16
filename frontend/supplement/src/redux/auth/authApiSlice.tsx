import { apiSlice } from "../api/apiSlice"
import { jwtDecode } from "jwt-decode";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        register: builder.mutation({
            query: credentials => ({
                url: '/auth/register',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        getLoggedUser: builder.query({
            query: token => {
                const userEmail = jwtDecode(token).sub;
                return `/api/v1/users/${userEmail}`;
            },  
        }),
    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetLoggedUserQuery,
    useLazyGetLoggedUserQuery,
  } = authApiSlice