import { createApi } from "@reduxjs/toolkit/query/react";
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
import type { CreateNoteCategory, NoteCategory, Note } from "../../types/note";
import { userTag, characterTag } from "./tags";
import invalidateApiTags from "./invalidateApiTags";

export const characterApiSlice = createApi({
  reducerPath: "characterApi",
  baseQuery,
  tagTypes: [userTag, characterTag],
  endpoints: (builder) => ({
    createCharacter: builder.mutation<CharacterBase, CreateCharacterBase>({
      query: (characterData) => ({
        url: "characters",
        method: "POST",
        body: characterData,
      }),
      onQueryStarted: invalidateApiTags([userTag]),
    }),
    deleteCharacter: builder.mutation<void, number>({
      query: (id) => ({
        url: `characters/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: invalidateApiTags([userTag]),
    }),
    getCharacterById: builder.query<CharacterData, number>({
      query: (id) => `characters/${id}`,
      providesTags: [characterTag],
    }),
    modifyCharacter: builder.mutation<void, CharacterData>({
      query: (characterData) => ({
        url: `characters/${characterData.ID}`,
        method: "PUT",
        body: characterData,
      }),
      invalidatesTags: [characterTag],
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
      invalidatesTags: [characterTag],
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
      invalidatesTags: [characterTag],
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
      invalidatesTags: [characterTag],
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
      invalidatesTags: [characterTag],
      onQueryStarted: invalidateApiTags([userTag]),
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
      invalidatesTags: [characterTag],
      onQueryStarted: invalidateApiTags([userTag]),
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
      invalidatesTags: [characterTag],
    }),

    deleteFeature: builder.mutation<void, { id: number; characterId: number }>({
      query: ({ id, characterId }) => ({
        url: `characters/${characterId}/features/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [characterTag],
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
      invalidatesTags: [characterTag],
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
      invalidatesTags: [characterTag],
    }),
    modifySpell: builder.mutation<void, { spell: Spell; characterId: number }>({
      query: ({ spell, characterId }) => ({
        url: `characters/${characterId}/spells/${spell.id}`,
        method: "PUT",
        body: spell,
      }),
      invalidatesTags: [characterTag],
    }),
    deleteSpell: builder.mutation<void, { id: number; characterId: number }>({
      query: ({ id, characterId }) => ({
        url: `characters/${characterId}/spells/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [characterTag],
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
      invalidatesTags: [characterTag],
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
      invalidatesTags: [characterTag],
    }),
    updateTrackerOrder: builder.mutation<
      void,
      { trackerIds: number[]; characterId: number }
    >({
      query: ({ trackerIds, characterId }) => ({
        url: `characters/${characterId}/trackers/order`,
        method: "PATCH",
        body: trackerIds,
      }),
      invalidatesTags: [characterTag],
    }),
    deleteTracker: builder.mutation<void, { id: number; characterId: number }>({
      query: ({ id, characterId }) => ({
        url: `characters/${characterId}/trackers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [characterTag],
    }),

    createNoteCategory: builder.mutation<
      void,
      { noteCategory: CreateNoteCategory; characterId: number }
    >({
      query: ({ noteCategory, characterId }) => ({
        url: `characters/${characterId}/notes`,
        method: "POST",
        body: noteCategory,
      }),
      invalidatesTags: [characterTag],
    }),
    modifyNoteCategory: builder.mutation<
      void,
      { noteCategory: NoteCategory; characterId: number }
    >({
      query: ({ noteCategory, characterId }) => ({
        url: `characters/${characterId}/notes/${noteCategory.id}`,
        method: "PUT",
        body: noteCategory,
      }),
      invalidatesTags: [characterTag],
    }),
    deleteNoteCategory: builder.mutation<
      void,
      { id: number; characterId: number }
    >({
      query: ({ id, characterId }) => ({
        url: `characters/${characterId}/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [characterTag],
    }),
    createNote: builder.mutation<
      void,
      { categoryId: number; characterId: number }
    >({
      query: ({ categoryId, characterId }) => ({
        url: `characters/${characterId}/notes/${categoryId}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: [characterTag],
    }),
    modifyNote: builder.mutation<
      void,
      { note: Note; categoryId: number; characterId: number }
    >({
      query: ({ note, categoryId, characterId }) => ({
        url: `characters/${characterId}/notes/${categoryId}/${note.id}`,
        method: "PUT",
        body: note,
      }),
    }),
    deleteNote: builder.mutation<
      void,
      { noteId: number; categoryId: number; characterId: number }
    >({
      query: ({ noteId, categoryId, characterId }) => ({
        url: `characters/${characterId}/notes/${categoryId}/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: [characterTag],
    }),
  }),
});

export const {
  useCreateCharacterMutation,
  useDeleteCharacterMutation,
  useGetCharacterByIdQuery,
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
  useUpdateTrackerOrderMutation,
  useDeleteTrackerMutation,
} = characterApiSlice;

export const {
  useCreateNoteCategoryMutation,
  useModifyNoteCategoryMutation,
  useDeleteNoteCategoryMutation,
  useCreateNoteMutation,
  useModifyNoteMutation,
  useDeleteNoteMutation,
} = characterApiSlice;
