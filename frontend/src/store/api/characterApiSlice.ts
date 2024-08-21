import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
import characterCard from "../../types/characterCard";


export const characterApiSlice = createApi({
  reducerPath: "characterApi",
  baseQuery,
  endpoints: (builder) => ({
    createCharacter: builder.mutation<void, characterCard>({
      query: (loginData) => ({
        url: `characters`,
        method: "POST",
        body: loginData,
      }),
    }),
    getCharacters: builder.query<characterCard[], void>({
      query: () => `characters`,
    }),
    setCharacterFavorite: builder.mutation<void, {id: number}>({
        query: ({ id }) => ({
            url: `characters/favorite/${id}`,
            method: "Post",
            body: {}
        }),
    }),
  }),
});

export const { useCreateCharacterMutation, useGetCharactersQuery, useSetCharacterFavoriteMutation } = characterApiSlice;
