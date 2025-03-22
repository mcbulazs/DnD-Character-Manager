import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
import { userApiSlice } from "./userApiSlice";
import type { Dispatch } from "@reduxjs/toolkit";
import type { CharacterBase } from "../../types/characterBase";

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

export const friendApiSlice = createApi({
  reducerPath: "friendApi",
  baseQuery,
  endpoints: (builder) => ({
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
    shareCharacter: builder.mutation<
      void,
      { friendId: number; characterId: number }
    >({
      query: ({ friendId, characterId }) => ({
        url: `friends/${friendId}/share/${characterId}`,
        method: "POST",
      }),
      onQueryStarted,
    }),
    unshareCharacter: builder.mutation<
      void,
      { friendId: number; characterId: number }
    >({
      query: ({ friendId, characterId }) => ({
        url: `friends/${friendId}/share/${characterId}`,
        method: "DELETE",
      }),
      onQueryStarted,
    }),
    getSharedCharacters: builder.query<CharacterBase[], number>({
      query: (friendId) => ({
        url: `friends/${friendId}/share`,
        method: "GET",
      }),
      onQueryStarted,
    }),
  }),
});

export const {
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useUnfriendMutation,
  useShareCharacterMutation,
  useUnshareCharacterMutation,
  useGetSharedCharactersQuery,
} = friendApiSlice;
