import type React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCharacterByIdQuery } from "../../../store/api/characterApiSlice";
import { setHeaderText } from "../../../store/utility/headerSlice";
import ArmorClass from "./components/ArmorClass";
import Initiative from "./components/Initiative";
import PassivePerception from "./components/PassivePerception";
import ProficiencyBonus from "./components/ProficiencyBonus";
import Speed from "./components/Speed";
import AbilitScoresComp from "./components/abilityScore/AbilityScoresComp";
import SavingThrowsComp from "./components/savingThrow/SavingThrowsComp";
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
		<div className="md:w-4/5 2xl:w-7/12 grid grid-rows-5 grid-cols-6 gap-5 place-items-center relative">
			<div className="col-span-full w-full h-full">
				<AbilitScoresComp
					abilityScores={character.abilityScores}
					characterID={character.ID}
				/>
			</div>
			<div className="w-full h-full col-span-2 row-span-4 flex flex-col gap-5 items-center">
				<SkillsComp
					skills={character.skills}
					characterID={character.ID}
					abilityScores={character.abilityScores}
					proficiencyBonus={character.proficiencyBonus}
				/>
				<PassivePerception
					value={character.passivePerception}
					wisdom={character.abilityScores.wisdom}
					perception={character.skills.perception}
					proficiencyBonus={character.proficiencyBonus}
					characterId={character.ID}
				/>
			</div>

			<div className="w-full h-full">
				<ProficiencyBonus
					value={character.proficiencyBonus}
					characterId={character.ID}
				/>
			</div>
			<div className="w-full h-full">
				<Initiative
					value={character.initiative}
					characterId={character.ID}
					dexterity={character.abilityScores.dexterity}
				/>
			</div>
			<div className="w-full h-full">
				<ArmorClass value={character.armorClass} characterID={character.ID} />
			</div>
			<div className="w-full h-full">
				<Speed value={character.speed} characterID={character.ID} />
			</div>
			<div className="border-4 border-black w-full h-full col-start-5 row-start-2 row-span-full col-span-full">
				<div />
			</div>
			<div className="row-span-2 col-span-2">
				<SavingThrowsComp
					savingThrows={character.savingThrows}
					characterID={character.ID}
					abilityScores={character.abilityScores}
					proficiencyBonus={character.proficiencyBonus}
				/>
			</div>
		</div>
	);
};

export default CharacterSheet;
