import type { Dispatch } from "@reduxjs/toolkit";
import { type TagDescription, createApi } from "@reduxjs/toolkit/query/react";
import type { BackgroundImageProps } from "../../types/backgroundImageProps";
import type {
	CharacterBase,
	CreateCharacterBase,
} from "../../types/characterBase";
import type {
	AbilityScores,
	CharacterData,
	SavingThrows,
	Skills,
} from "../../types/characterData";
import baseQuery from "./baseQuery";

type Tags = TagDescription<"Characters" | "Character">;

const onQueryStarted =
	(tags: Tags[]) =>
	async (
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
			dispatch(characterApiSlice.util.invalidateTags(tags));
		} catch (error) {
			console.error("Failed to handle mutation:", error);
		}
	};

export const characterApiSlice = createApi({
	reducerPath: "characterApi",
	baseQuery,
	tagTypes: ["Characters", "Character"],
	endpoints: (builder) => ({
		createCharacter: builder.mutation<void, CreateCharacterBase>({
			query: (characterData) => ({
				url: "characters",
				method: "POST",
				body: characterData,
			}),
			onQueryStarted: onQueryStarted(["Characters"]),
			invalidatesTags: ["Characters"],
		}),
		deleteCharacter: builder.mutation<void, number>({
			query: (id) => ({
				url: `characters/${id}`,
				method: "DELETE",
			}),
			onQueryStarted: onQueryStarted(["Characters"]),
			invalidatesTags: ["Characters"],
		}),
		getCharacterById: builder.query<CharacterData, number>({
			query: (id) => `characters/${id}`,
			providesTags: ["Character"],
		}),
		modifyCharacter: builder.mutation<void, CharacterData>({
			query: (characterData) => ({
				url: `characters/${characterData.ID}`,
				method: "PUT",
				body: characterData,
			}),
			onQueryStarted: onQueryStarted(["Character", "Characters"]),
			invalidatesTags: ["Character", "Characters"],
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
			onQueryStarted: onQueryStarted(["Character", "Characters"]),
			invalidatesTags: ["Character", "Characters"],
		}),
		modifyCharacterSkills: builder.mutation<
			Skills,
			{ skills: Skills; characterID: number }
		>({
			query: ({ skills, characterID }) => ({
				url: `characters/${characterID}/skills`,
				method: "PUT",
				body: skills,
			}),
			onQueryStarted: onQueryStarted(["Character", "Characters"]),
			invalidatesTags: ["Character", "Characters"],
		}),
		modifyCharacterSavingThrows: builder.mutation<
			SavingThrows,
			{ savingThrows: SavingThrows; characterID: number }
		>({
			query: ({ savingThrows, characterID }) => ({
				url: `characters/${characterID}/saving-throws`,
				method: "PUT",
				body: savingThrows,
			}),
			onQueryStarted: onQueryStarted(["Character", "Characters"]),
			invalidatesTags: ["Character", "Characters"],
		}),
		modifyCharacterImage: builder.mutation<
			BackgroundImageProps,
			{ image: BackgroundImageProps; characterID: number }
		>({
			query: ({ image, characterID }) => ({
				url: `characters/${characterID}/image`,
				method: "PUT",
				body: image,
			}),
			onQueryStarted: onQueryStarted(["Character", "Characters"]),
			invalidatesTags: ["Character", "Characters"],
		}),
		setCharacterAttribute: builder.mutation<
			CharacterData,
			{ data: Partial<CharacterData>; id: number }
		>({
			query: ({ data, id }) => ({
				url: `characters/${id}/attributes`,
				method: "PATCH",
				body: data,
			}),
			onQueryStarted: onQueryStarted(["Character", "Characters"]),
			invalidatesTags: ["Character", "Characters"],
		}),
		getCharacters: builder.query<CharacterBase[], void>({
			query: () => "characters",
			providesTags: ["Characters"],
		}),
	}),
});

export const {
	useCreateCharacterMutation,
	useDeleteCharacterMutation,
	useGetCharacterByIdQuery,
	useGetCharactersQuery,
	useModifyCharacterMutation,
	useModifyCharacterAbilityScoresMutation,
	useModifyCharacterSkillsMutation,
	useModifyCharacterSavingThrowsMutation,
	useModifyCharacterImageMutation,
	useSetCharacterAttributeMutation,
} = characterApiSlice;
