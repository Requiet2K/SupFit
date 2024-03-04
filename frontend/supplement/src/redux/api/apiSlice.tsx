import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../../types/loginTypes'
import { login, logout } from '../auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => { 
        const state = getState() as AuthState;
        const token = state.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
})

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error && 'originalStatus' in result.error){
        if (result?.error?.originalStatus === 403) {
            console.log('sending refresh token');
            const refreshResult = await baseQuery('/refresh', api, extraOptions);
            console.log(refreshResult);
            if (refreshResult?.data) {
                const user = api.getState().user;
                api.dispatch(login({ ...refreshResult.data, user }));
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout({}));
            }
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})
