import type { Dispatch } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
	CharacterBase,
	CreateCharacterBase,
} from "../../types/characterBase";
import type { AbilityScores, CharacterData } from "../../types/characterData";
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
		createCharacter: builder.mutation<void, CreateCharacterBase>({
			query: (characterData) => ({
				url: "characters",
				method: "POST",
				body: characterData,
			}),
			onQueryStarted, // reuse the onQueryStarted function
			invalidatesTags: ["Characters"], // Automatically invalidate the 'Characters' tag
		}),
		getCharacterById: builder.query<CharacterData, number>({
			query: (id) => `characters/${id}`,
		}),
		modifyCharacter: builder.mutation<void, CharacterData>({
			query: (characterData) => ({
				url: `characters/${characterData.ID}`,
				method: "PUT",
				body: characterData,
			}),
		}),
		modifyCharacterAbilityScores: builder.mutation<
			AbilityScores,
			{ abilityScores: AbilityScores; characterID: number }
		>({
			query: ({ abilityScores, characterID }) => ({
				url: `characters/${characterID}/ability-scores`,
				method: "PUT",
				body: abilityScores,
			}),
		}),

		getCharacters: builder.query<CharacterBase[], void>({
			query: () => "characters",
			providesTags: ["Characters"], // Indicate this query provides the 'Characters' tag
		}),
		setCharacterFavorite: builder.mutation<void,  number>({
			query: (id) => ({
				url: `characters/favorite/${id}`,
				method: "PATCH",
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
	useModifyCharacterMutation,
	useModifyCharacterAbilityScoresMutation,
} = characterApiSlice;
