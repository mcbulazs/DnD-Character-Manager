import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
import type { CharacterBase } from "../../types/characterBase";
import { userTag } from "./tags";
import invalidateApiTags from "./invalidateApiTags";

export const friendApiSlice = createApi({
  reducerPath: "friendApi",
  baseQuery,
  tagTypes: [userTag],
  endpoints: (builder) => ({
    sendFriendRequest: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: "friendRequest",
        method: "POST",
        body: { email },
      }),
    }),
    acceptFriendRequest: builder.mutation<void, { friendRequestId: number }>({
      query: ({ friendRequestId }) => ({
        url: `friendRequest/${friendRequestId}/accept`,
        method: "PATCH",
      }),
      onQueryStarted: invalidateApiTags([userTag]),
    }),
    declineFriendRequest: builder.mutation<void, { friendRequestId: number }>({
      query: ({ friendRequestId }) => ({
        url: `friendRequest/${friendRequestId}/decline`,
        method: "PATCH",
      }),
      onQueryStarted: invalidateApiTags([userTag]),
    }),
    unfriend: builder.mutation<void, { friendId: number }>({
      query: ({ friendId }) => ({
        url: `friends/${friendId}`,
        method: "DELETE",
      }),
      onQueryStarted: invalidateApiTags([userTag]),
    }),
    shareCharacter: builder.mutation<
      void,
      { friendId: number; characterId: number }
    >({
      query: ({ friendId, characterId }) => ({
        url: `friends/${friendId}/share/${characterId}`,
        method: "POST",
      }),
    }),
    unshareCharacter: builder.mutation<
      void,
      { friendId: number; characterId: number }
    >({
      query: ({ friendId, characterId }) => ({
        url: `friends/${friendId}/share/${characterId}`,
        method: "DELETE",
      }),
    }),
    getSharedCharacters: builder.query<CharacterBase[], number>({
      query: (friendId) => ({
        url: `friends/${friendId}/share`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useUnfriendMutation,
  useShareCharacterMutation,
  useUnshareCharacterMutation,
  useGetSharedCharactersQuery,
} = friendApiSlice;

export const {
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
} = friendApiSlice;
