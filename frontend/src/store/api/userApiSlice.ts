import type { Dispatch } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import type AuthUser from "../../types/user";
import baseQuery from "./baseQuery";
import type { UserData } from "../../types/user";

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
    register: builder.mutation<void, AuthUser>({
      query: (registerData) => ({
        url: "register",
        method: "POST",
        body: registerData,
      }),
      onQueryStarted,
    }),
    login: builder.mutation<void, AuthUser>({
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
    getUserData: builder.query<UserData, void>({
      query: () => ({
        url: "user",
        method: "GET",
      }),
      onQueryStarted,
    }),
    sendFriendRequest: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: "friendRequest",
        method: "POST",
        body: { email },
      }),
      onQueryStarted,
    }),
    acceptFriendRequest: builder.mutation<void, { friendRequestId: number }>({
      query: ({ friendRequestId }) => ({
        url: `friendRequest/${friendRequestId}/accept`,
        method: "PATCH",
      }),
      onQueryStarted,
    }),
    declineFriendRequest: builder.mutation<void, { friendRequestId: number }>({
      query: ({ friendRequestId }) => ({
        url: `friendRequest/${friendRequestId}/decline`,
        method: "PATCH",
      }),
      onQueryStarted,
    }),
    unfriend: builder.mutation<void, { friendId: number }>({
      query: ({ friendId }) => ({
        url: `friends/${friendId}`,
        method: "DELETE",
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
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useUnfriendMutation,
} = userApiSlice;

export const { useGetUserDataQuery } = userApiSlice;

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useIsAuthenticatedQuery,
} = userApiSlice;
