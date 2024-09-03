import type React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCharacterByIdQuery } from "../../../store/api/characterApiSlice";
import { setHeaderText } from "../../../store/utility/headerSlice";
import ArmorClass from "./components/ArmorClass";
import CharacterClass from "./components/CharacterClass";
import CharacterImage from "./components/CharacterImage";
import CharacterLevel from "./components/CharacterLevel";
import CharacterName from "./components/CharacterName";
import CharacterRace from "./components/CharacterRace";
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
		<div className="md:w-4/5 2xl:w-7/12 grid grid-cols-6 gap-5 place-items-center relative">
			<div className="col-span-full w-full h-full">
				<AbilitScoresComp
					abilityScores={character.abilityScores}
					characterID={character.ID}
				/>
			</div>
			<div className="w-full h-full col-span-2 flex flex-col gap-5 items-center justify-between">
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
			<div className="col-span-2 grid grid-cols-2 grid-rows-7 w-full h-full">
				<CharacterName name={character.name} characterID={character.ID} />
				<div className="w-full h-full row-span-2">
					<ProficiencyBonus
						value={character.proficiencyBonus}
						characterId={character.ID}
					/>
				</div>
				<div className="w-full h-full row-span-2">
					<Initiative
						value={character.initiative}
						characterId={character.ID}
						dexterity={character.abilityScores.dexterity}
					/>
				</div>
				<div className="w-full h-full row-span-2">
					<ArmorClass value={character.armorClass} characterID={character.ID} />
				</div>
				<div className="w-full h-full row-span-2">
					<Speed value={character.speed} characterID={character.ID} />
				</div>
				<div className="col-span-2 row-span-2 place-self-end w-full">
					<SavingThrowsComp
						savingThrows={character.savingThrows}
						characterID={character.ID}
						abilityScores={character.abilityScores}
						proficiencyBonus={character.proficiencyBonus}
					/>
				</div>
			</div>
			<div className="w-full h-full col-span-2">
				<div className="w-full h-full grid grid-cols-2 gap-3">
					<CharacterClass
						characterClass={character.class}
						characterID={character.ID}
					/>
					<CharacterLevel level={character.level} characterID={character.ID} />
					<CharacterRace race={character.race} characterID={character.ID} />
					<CharacterImage image={character.image} />
				</div>
			</div>
		</div>
	);
};

export default CharacterSheet;
