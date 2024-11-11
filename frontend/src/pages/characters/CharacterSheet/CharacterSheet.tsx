import DeleteIcon from "@mui/icons-material/Delete";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteDialog from "../../../components/DeleteDialog";
import { useCharacterContext } from "../../../layout/Contexts/CharacterContext";
import { useHeaderContext } from "../../../layout/Contexts/HeaderContext";
import {
  useDeleteCharacterMutation,
  useSetCharacterAttributeMutation,
} from "../../../store/api/characterApiSlice";
import type { CharacterData } from "../../../types/characterData";
import debounce from "../../../utility/debounce";
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

const CharacterSheetHeader: React.FC<{ character: CharacterData }> = ({
  character,
}) => {
  const [isFavorite, setIsFavorite] = useState(character.isFavorite);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [setCharacterAttribute] = useSetCharacterAttributeMutation();
  const [deleteCharacterMutation] = useDeleteCharacterMutation();
  const navigate = useNavigate();

  const favoriteDebounce = useCallback(
    debounce(async (isFavorite) => {
      try {
        setCharacterAttribute({
          data: { isFavorite },
          id: character.ID,
        }).unwrap();
      } catch (error) {
        toast("Error updating favorite", { type: "error" });
        console.error("Error updating favorite", error);
      }
    }, 300),
    [],
  );
  const handleFavorite = async (e: React.MouseEvent) => {
    if (e.button !== 0) {
      return;
    }
    favoriteDebounce(!isFavorite);
    setIsFavorite(!isFavorite);
  };
  const handleDelete = async () => {
    try {
      setDeleteOpen(false);
      deleteCharacterMutation(character.ID).unwrap();
      navigate("/characters");
    } catch (error) {
      toast("Error deleting character", { type: "error" });
      console.error("Error deleting character", error);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <DeleteIcon
        htmlColor="red"
        fontSize="large"
        className="cursor-pointer"
        onClick={() => setDeleteOpen(true)}
      />
      {deleteOpen && (
        <DeleteDialog
          onCancel={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          message={`Are you sure you want to delete  the character: ${character.name}?`}
        />
      )}

      <h1 className="text-3xl font-bold">{character.name}</h1>

      <div className="right-0 top-0 m-2 z-2 cursor-pointer">
        {isFavorite ? (
          <svg
            className="w-10 h-10 text-yellow-300 transition-transform duration-300 ease-in-out"
            fill="currentColor"
            stroke="black"
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            onMouseDown={handleFavorite}
          >
            <title>Favorite</title>
            <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" />
          </svg>
        ) : (
          <svg
            className="w-10 h-10 text-black transition-opacity duration-300 ease-in-out transform scale-95 group-hover:scale-105"
            fill="none"
            stroke="black"
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            onMouseDown={handleFavorite}
          >
            <title>Favorite</title>
            <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" />
          </svg>
        )}
      </div>
    </div>
  );
};

const CharacterSheet: React.FC = () => {
  const { setTitle } = useHeaderContext();

  const { character, error, isLoading } = useCharacterContext();

  useEffect(() => {
    if (!character) return;

    setTitle(<CharacterSheetHeader character={character} />);
  }, [setTitle, character]);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    toast("Error loading character", { type: "error" });
    console.error("Error loading character", error);
    return <div>Error loading character</div>;
  }
  if (!character) return <div>Character not found</div>;
  //FIX: biome going insane on class formatting
  return (
    <div
      className="
grid
w-4/5 xs:w-3/4 sm:w-full md:w-full lg:w-4/5 xl:w-7/12 
grid-cols-2 sm:grid-cols-4 2xl:grid-cols-6

gap-5 
justify-items-center items-center place-items-center
 relative"
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
      <div
        className="w-full h-full
order-10 sm:order-8 2xl:order-4"
      >
        <CharacterClass
          characterClass={character.class}
          characterID={character.ID}
        />
      </div>
      <div
        className="
w-1/2 2xl:w-full
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
        <CharacterImage image={character.image} characterID={character.ID} />
      </div>
      <div
        className="w-full h-full 
row-span-1
order-3 sm:order-6 2xl:order-10"
      >
        <ArmorClass value={character.armorClass} characterID={character.ID} />
      </div>

      <div
        className="w-full h-full 
row-span-1
order-9 sm:order-7 2xl:order-11"
      >
        <Speed value={character.speed} characterID={character.ID} />
      </div>
      <div
        className="w-full h-full
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
      <div
        className="flex justify-center
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
