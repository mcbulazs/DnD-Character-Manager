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
import type { CreateFeature, Feature } from "../../types/feature";
import type { CreateSpell, Spell } from "../../types/spell";
import type { CreateTracker, Tracker } from "../../types/tracker";
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
		createCharacter: builder.mutation<CharacterBase, CreateCharacterBase>({
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

		createFeature: builder.mutation<
			Feature,
			{ feature: CreateFeature; characterId: number }
		>({
			query: ({ feature, characterId }) => ({
				url: `characters/${characterId}/features`,
				method: "POST",
				body: feature,
			}),
			onQueryStarted: onQueryStarted(["Character"]),
			invalidatesTags: ["Character"],
		}),
		deleteFeature: builder.mutation<void, { id: number; characterId: number }>({
			query: ({ id, characterId }) => ({
				url: `characters/${characterId}/features/${id}`,
				method: "DELETE",
			}),
			onQueryStarted: onQueryStarted(["Character"]),
			invalidatesTags: ["Character"],
		}),
		modifyFeature: builder.mutation<
			void,
			{ feature: Feature; characterId: number }
		>({
			query: ({ feature, characterId }) => ({
				url: `characters/${characterId}/features/${feature.id}`,
				method: "PUT",
				body: feature,
			}),
			onQueryStarted: onQueryStarted(["Character"]),
			invalidatesTags: ["Character"],
		}),

		createSpell: builder.mutation<
			Spell,
			{ spell: CreateSpell; characterId: number }
		>({
			query: ({ spell, characterId }) => ({
				url: `characters/${characterId}/spells`,
				method: "POST",
				body: spell,
			}),
			onQueryStarted: onQueryStarted(["Character"]),
			invalidatesTags: ["Character"],
		}),
		modifySpell: builder.mutation<void, { spell: Spell; characterId: number }>({
			query: ({ spell, characterId }) => ({
				url: `characters/${characterId}/spells/${spell.id}`,
				method: "PUT",
				body: spell,
			}),
			onQueryStarted: onQueryStarted(["Character"]),
			invalidatesTags: ["Character"],
		}),
		deleteSpell: builder.mutation<void, { id: number; characterId: number }>({
			query: ({ id, characterId }) => ({
				url: `characters/${characterId}/spells/${id}`,
				method: "DELETE",
			}),
			onQueryStarted: onQueryStarted(["Character"]),
			invalidatesTags: ["Character"],
		}),

		createTracker: builder.mutation<
			void,
			{ tracker: CreateTracker; characterId: number }
		>({
			query: ({ tracker, characterId }) => ({
				url: `characters/${characterId}/trackers`,
				method: "POST",
				body: tracker,
			}),
			onQueryStarted: onQueryStarted(["Character"]),
			invalidatesTags: ["Character"],
		}),
		modifyTracker: builder.mutation<
			void,
			{ tracker: Tracker; characterId: number }
		>({
			query: ({ tracker, characterId }) => ({
				url: `characters/${characterId}/trackers/${tracker.id}`,
				method: "PUT",
				body: tracker,
			}),
			onQueryStarted: onQueryStarted(["Character"]),
			invalidatesTags: ["Character"],
		}),
		deleteTracker: builder.mutation<void, { id: number; characterId: number }>({
			query: ({ id, characterId }) => ({
				url: `characters/${characterId}/trackers/${id}`,
				method: "DELETE",
			}),
			onQueryStarted: onQueryStarted(["Character"]),
			invalidatesTags: ["Character"],
		}),
	}),
});

export const {
	useCreateCharacterMutation,
	useDeleteCharacterMutation,
	useGetCharacterByIdQuery,
	useGetCharactersQuery,
	useModifyCharacterMutation,
} = characterApiSlice;

export const {
	useModifyCharacterAbilityScoresMutation,
	useModifyCharacterSkillsMutation,
	useModifyCharacterSavingThrowsMutation,
	useModifyCharacterImageMutation,
	useSetCharacterAttributeMutation,
} = characterApiSlice;

export const {
	useCreateFeatureMutation,
	useDeleteFeatureMutation,
	useModifyFeatureMutation,
} = characterApiSlice;

export const {
	useCreateSpellMutation,
	useModifySpellMutation,
	useDeleteSpellMutation,
} = characterApiSlice;

export const {
	useCreateTrackerMutation,
	useModifyTrackerMutation,
	useDeleteTrackerMutation,
} = characterApiSlice;