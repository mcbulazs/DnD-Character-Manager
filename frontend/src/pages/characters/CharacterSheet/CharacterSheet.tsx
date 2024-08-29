import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCharacterByIdQuery } from "../../../store/api/characterApiSlice";
import { useModifyCharacterAbilityScoresMutation } from "../../../store/api/characterApiSlice";
import { setHeaderText } from "../../../store/utility/headerSlice";
import type { AbilityScores } from "../../../types/characterData";
import debounce from "../../../utility/debounce";
import AbilitScoresComp from "./components/AbilityScores";

const defaultAbilityScores: AbilityScores = {
	strength: { value: 0, modifier: 0 },
	dexterity: { value: 0, modifier: 0 },
	constitution: { value: 0, modifier: 0 },
	intelligence: { value: 0, modifier: 0 },
	wisdom: { value: 0, modifier: 0 },
	charisma: { value: 0, modifier: 0 },
};

const CharacterSheet: React.FC = () => {
	const dispatch = useDispatch();
	const { characterId } = useParams();
	const [abilityScores, setAbilityScores] =
		useState<AbilityScores>(defaultAbilityScores);

	const [modifyCharacterAbilityScoresMutation] =
		useModifyCharacterAbilityScoresMutation();
	if (!characterId || Number.isNaN(Number.parseInt(characterId))) {
		return <div>Invalid character ID</div>;
	}

	const {
		data: character,
		error,
		isLoading,
	} = useGetCharacterByIdQuery(Number.parseInt(characterId));

	useEffect(() => {
		dispatch(setHeaderText(character?.name ?? "Character Sheet"));
		setAbilityScores(character?.abilityScores ?? defaultAbilityScores);
	}, [dispatch, character]);

	const debounceModify = useCallback(
		debounce(async (as: AbilityScores, characterID: number) => {
			try {
				const response = await modifyCharacterAbilityScoresMutation({
					abilityScores: as,
					characterID: characterID,
				}).unwrap(); // Use unwrap() if using Redux Toolkit Query

				// Handle successful response
				setAbilityScores(response); // or response.data if needed
			} catch (error) {
				// Handle error
				toast("Error updating ability scores", { type: "error" });
				console.error("Error updating ability scores", error);
			}
		}, 1000),
		[],
	);

	if (isLoading) return <div>Loading...</div>;
	if (error) {
		toast("Error loading character", { type: "error" });
		console.error("Error loading character", error);
		return <div>Error loading character</div>;
	}
	if (!character) return <div>Character not found</div>;

	const updateAbilityScores = (as: AbilityScores) => {
		debounceModify(as, character.ID);
		setAbilityScores(as);
	};
	return (
		<div className="w-full h-auto">
			<div
				className="
w-full 
flex flex-row flex-wrap justify-center gap-4"
			>
				<AbilitScoresComp
					scores={abilityScores}
					updateAbilityScores={updateAbilityScores}
				/>
			</div>
		</div>
	);
};

export default CharacterSheet;
