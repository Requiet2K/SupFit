import { createSlice } from "@reduxjs/toolkit"
import { AuthState } from "../../types/userTypes"
import { jwtDecode } from "jwt-decode";

const initialState: AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
    token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') as string) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state: AuthState, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', JSON.stringify(token));
            localStorage.setItem('exp', JSON.stringify(jwtDecode(token).exp));
        },
        logout: (state, action) => {
            state.user = undefined;
            state.token = undefined;
            localStorage.clear();
            localStorage.setItem('userLoggedIn', "false");
        },
        updateToken: (state, action) => {
            state.token = action.payload.token;
            localStorage.setItem('token', JSON.stringify(action.payload.token));
            localStorage.setItem('exp', JSON.stringify(jwtDecode(action.payload.token).exp));
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        }
    },
})

export const { login, logout, updateToken, updateUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state:{auth: AuthState}) => state.auth.user;
export const selectCurrentToken = (state: {auth: AuthState}) => state.auth.token;