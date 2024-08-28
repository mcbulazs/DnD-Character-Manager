import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCharacterByIdQuery } from "../../../store/api/characterApiSlice";
import { useModifyCharacterMutation } from "../../../store/api/characterApiSlice";
import { setHeaderText } from "../../../store/utility/headerSlice";
import type { AbilityScores } from "../../../types/characterData";
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

	const [modifyCharacterMutation] = useModifyCharacterMutation();
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

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		toast("Error loading character", { type: "error" });
		console.error("Error loading character", error);
		return <div>Error loading character</div>;
	}
	if (!character) {
		return <div>Character not found</div>;
	}
	const updateAbilityScores = (as: AbilityScores) => {
		setAbilityScores(as);
		modifyCharacterMutation(character);
	};
	return (
		<div className="w-full h-auto">
			<div className="
				w-full 
				flex flex-row flex-wrap justify-center gap-4">
				<AbilitScoresComp
					scores={abilityScores}
					updateAbilityScores={updateAbilityScores}
				/>
			</div>
		</div>
	);
};

export default CharacterSheet;
