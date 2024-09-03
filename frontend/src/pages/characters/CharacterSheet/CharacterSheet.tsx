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
		<div
			className={`
				grid
				w-4/5 xs:w-3/4 sm:w-full md:w-full lg:w-4/5 xl:w-7/12 
				grid-cols-2 sm:grid-cols-4 2xl:grid-cols-6
				
				gap-5 
				justify-items-center items-center place-items-center
				 relative`}
		>
			<div
				className="w-full
				col-span-full
				order-4 sm:order-1"
			>
				<AbilitScoresComp
					abilityScores={character.abilityScores}
					characterID={character.ID}
				/>
			</div>
			<div
				className="w-full
				col-span-2 
				sm:row-span-4 2xl:row-span-5 
				order-5 sm:order-2"
			>
				<SkillsComp
					skills={character.skills}
					characterID={character.ID}
					abilityScores={character.abilityScores}
					proficiencyBonus={character.proficiencyBonus}
				/>
			</div>
			<div
				className="
				col-span-2
				order-1 sm:order-3"
			>
				<CharacterName name={character.name} characterID={character.ID} />
			</div>
			<div className="w-full h-full
				order-10 sm:order-8 2xl:order-4"
			>
				<CharacterClass
					characterClass={character.class}
					characterID={character.ID}
				/>
			</div>
			<div
				className=" w-1/2 2xl:w-full
				2xl:row-span-2
				col-span-2 2xl:col-span-1
				order-[13] sm:order-13 2xl:order-5"
			>
				<CharacterLevel level={character.level} characterID={character.ID} />
			</div>

			<div
				className="w-full h-full 
				2xl:row-span-2
				order-2 sm:order-4 2xl:order-6"
			>
				<ProficiencyBonus
					value={character.proficiencyBonus}
					characterId={character.ID}
				/>
			</div>
			<div
				className="w-full h-full 
				2xl:row-span-2
				order-8 sm:order-5 md:order-7"
			>
				<Initiative
					value={character.initiative}
					characterId={character.ID}
					dexterity={character.abilityScores.dexterity}
				/>
			</div>
			<div
				className="w-full h-full 
				order-11 sm:order-9 2xl:order-8"
			>
				<CharacterRace race={character.race} characterID={character.ID} />
			</div>
			<div
				className="w-full h-full
				col-span-2
				sm:row-span-3 2xl:row-span-4
				order-12 sm:order-11 2xl:order-9"
			>
				<CharacterImage image={character.image} />
			</div>
			<div className="w-full h-full 
				row-span-1
				order-3 sm:order-6 2xl:order-10"
			>
				<ArmorClass value={character.armorClass} characterID={character.ID} />
			</div>

			<div className="w-full h-full 
				row-span-1
				order-9 sm:order-7 2xl:order-11"
			>
				<Speed value={character.speed} characterID={character.ID} />
			</div>
			<div className="w-full h-full
				col-span-2 
				sm:row-span-1 2xl:row-span-2 
				order-7 sm:order-12 2xl:order-12"
			>
				<SavingThrowsComp
					savingThrows={character.savingThrows}
					characterID={character.ID}
					abilityScores={character.abilityScores}
					proficiencyBonus={character.proficiencyBonus}
				/>
			</div>
			<div className="flex justify-center
				col-span-2
				2xl:row-span-1
				order-6 sm:order-10 2xl:order-[13]"
			>
				<PassivePerception
					value={character.passivePerception}
					wisdom={character.abilityScores.wisdom}
					perception={character.skills.perception}
					proficiencyBonus={character.proficiencyBonus}
					characterId={character.ID}
				/>
			</div>
		</div>
	);
};

export default CharacterSheet;
