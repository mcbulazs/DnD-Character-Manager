import type { Dispatch } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import type characterCard from "../../types/characterCard";
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
		dispatch(characterApiSlice.util.invalidateTags(["Characters"]));
	} catch (error) {
		console.error("Failed to handle mutation:", error);
	}
};

export const characterApiSlice = createApi({
	reducerPath: "characterApi",
	baseQuery,
	tagTypes: ["Characters"], // Register 'Characters' as a valid tag type
	endpoints: (builder) => ({
		createCharacter: builder.mutation<void, characterCard>({
			query: (characterData) => ({
				url: "characters",
				method: "POST",
				body: characterData,
			}),
			onQueryStarted, // reuse the onQueryStarted function
			invalidatesTags: ["Characters"], // Automatically invalidate the 'Characters' tag
		}),
		getCharacterById: builder.query<characterCard, number>({
			query: (id) => `characters/${id}`,
		}),
		getCharacters: builder.query<characterCard[], void>({
			query: () => "characters",
			providesTags: ["Characters"], // Indicate this query provides the 'Characters' tag
		}),
		setCharacterFavorite: builder.mutation<void, { id: number }>({
			query: ({ id }) => ({
				url: `characters/favorite/${id}`,
				method: "POST",
				body: {},
			}),
			onQueryStarted, // reuse the onQueryStarted function
			invalidatesTags: ["Characters"], // Automatically invalidate the 'Characters' tag
		}),
	}),
});

export const {
	useCreateCharacterMutation,
	useGetCharacterByIdQuery,
	useGetCharactersQuery,
	useSetCharacterFavoriteMutation,
} = characterApiSlice;
