import type { Dispatch } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import type User from "../../types/user";
import baseQuery from "./baseQuery";

const onQueryStarted = async (
    _arg: unknown, // or you can make this generic <T>(arg: T, ...)
    {
        dispatch,
        queryFulfilled,
    }: {
        dispatch: Dispatch;
        queryFulfilled: Promise<unknown>;
    },
) => {
    try {
        await queryFulfilled;
        dispatch(userApiSlice.util.invalidateTags(["AuthStatus"]));
    } catch (error) {
        console.error("Failed to handle mutation:", error);
    }
};

export const userApiSlice = createApi({
    reducerPath: "userApi",
    baseQuery,
    tagTypes: ["AuthStatus"],
    endpoints: (builder) => ({
        register: builder.mutation<void, User>({
            query: (registerData) => ({
                url: "register",
                method: "POST",
                body: registerData,
            }),
            onQueryStarted,
        }),
        login: builder.mutation<void, User>({
            query: (loginData) => ({
                url: "login",
                method: "POST",
                body: loginData,
            }),
            onQueryStarted,
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "logout",
                method: "POST",
            }),
            onQueryStarted,
        }),
        isAuthenticated: builder.query<{ authenticated: boolean }, void>({
            query: () => "auth",
            providesTags: ["AuthStatus"],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useIsAuthenticatedQuery,
} = userApiSlice;
