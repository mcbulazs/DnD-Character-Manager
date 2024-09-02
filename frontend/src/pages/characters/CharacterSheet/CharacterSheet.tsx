import type React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCharacterByIdQuery } from "../../../store/api/characterApiSlice";
import { setHeaderText } from "../../../store/utility/headerSlice";
import AbilitScoresComp from "./components/abilityScore/AbilityScoresComp";
import SkillsComp from "./components/skill/SkillsComp";

const CharacterSheet: React.FC = () => {
	const dispatch = useDispatch();
	const { characterId } = useParams();

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
	}, [dispatch, character]);

	if (isLoading) return <div>Loading...</div>;
	if (error) {
		toast("Error loading character", { type: "error" });
		console.error("Error loading character", error);
		return <div>Error loading character</div>;
	}
	if (!character) return <div>Character not found</div>;

	return (
		<div className="w-4/5 h-auto">
			<AbilitScoresComp
				abilityScores={character.abilityScores}
				characterID={character.ID}
			/>
			<SkillsComp
				skills={character.skills}
				characterID={character.ID}
				abilityScores={character.abilityScores}
				proficiencyBonus={character.proficiencyBonus}
			/>
		</div>
	);
};

export default CharacterSheet;
