import { createApi } from "@reduxjs/toolkit/query/react";
import type AuthUser from "../../types/user";
import baseQuery from "./baseQuery";
import type { UserData } from "../../types/user";
import { authStatusTag, userTag } from "./tags";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: [authStatusTag, userTag],
  endpoints: (builder) => ({
    register: builder.mutation<void, AuthUser>({
      query: (registerData) => ({
        url: "register",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: [authStatusTag, userTag],
    }),
    login: builder.mutation<void, AuthUser>({
      query: (loginData) => ({
        url: "login",
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: [authStatusTag, userTag],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      invalidatesTags: [authStatusTag],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Manually clear the cache for getUserData
          dispatch(
            userApiSlice.util.upsertQueryData("getUserData", undefined, null),
          );
        } catch (error) {
          console.error("Logout failed", error);
        }
      },
    }),
    getUserData: builder.query<UserData | null, void>({
      query: () => "user",
      providesTags: [userTag],
    }),

    isAuthenticated: builder.query<{ authenticated: boolean }, void>({
      query: () => "auth",
      providesTags: [authStatusTag],
    }),
  }),
});

export const { useGetUserDataQuery } = userApiSlice;

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useIsAuthenticatedQuery,
} = userApiSlice;
