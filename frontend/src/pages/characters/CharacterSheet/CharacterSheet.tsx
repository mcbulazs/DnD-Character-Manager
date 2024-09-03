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
		<div className="
				grid
				w-4/5 xs:w-3/4 sm:w-full md:w-full lg:w-4/5 xl:w-7/12 
				grid-cols-1 sm:grid-cols-2  md:grid-cols-3
				gap-5 
				place-items-center relative">
			<AbilitScoresComp
				abilityScores={character.abilityScores}
				characterID={character.ID}
			/>
			<div className="w-full h-full flex flex-col gap-5 items-center justify-between 
					order-2 sm:order-1">
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
			<div className="grid grid-cols-2 grid-rows-7 w-full h-full 
					order-1	sm:order-2">
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
			<div className="w-full h-full
					order-3
					col-span-1 sm:col-span-2 md:col-span-1">
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
