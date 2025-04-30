import InfoIcon from "@mui/icons-material/Info";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AbilityScoreInfo from "/publicfile_AbilityScoreInfo.png";
import { useModifyCharacterAbilityScoresMutation } from "../../../../../store/api/characterApiSlice";
import type { AbilityScores } from "../../../../../types/characterData";
import debounce from "../../../../../utility/debounce";
import AbilityScore from "./AbilityScore";

const AbilitScoresComp: React.FC<{
  abilityScores: AbilityScores;
  characterID: number;
  canEdit: boolean;
}> = ({ abilityScores: _abilityScores, characterID, canEdit }) => {
  const [abilityScores, setAbilityScores] =
    useState<AbilityScores>(_abilityScores);
  const [isHovered, setIsHovered] = useState(false);
  const [modifyCharacterAbilityScoresMutation] =
    useModifyCharacterAbilityScoresMutation();
  const [imgWidth, setImgWidth] = useState(0);

  useEffect(() => {
    setAbilityScores(_abilityScores);
  }, [_abilityScores]);

  useEffect(() => {
    const img = new Image();
    img.src = AbilityScoreInfo;
    img.onload = () => {
      setImgWidth(img.width);
    };
  }, []);

  const debounceModifyAbilityScores = useCallback(
    debounce(async (abilityScores: AbilityScores) => {
      try {
        modifyCharacterAbilityScoresMutation({
          abilityScores,
          characterID,
        }).unwrap();
      } catch (error) {
        toast("Error updating ability scores", { type: "error" });
        console.error("Error updating ability scores", error);
      }
    }, 300),
    [],
  );

  return (
    <div
      className="
			w-full h-full
			
			grid place-items-center
			grid-cols-3 sm:grid-cols-6 
			grid-rows-2 sm:grid-rows-1
			gap-1 xs:gap-5 sm:gap-1 lg:gap-5
			gap-y-5 sm:gap-y-0 
			relative"
    >
      {/*
      <div
        className="absolute right-[-1.5rem] top-0 z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <InfoIcon />
      </div>
      isHovered  && (
				<img
					src={AbilityScoreInfo}
					alt="Ability Score Info"
					className="absolute mt-20 border-4 border-black rounded-lg z-50 right-[-2.5rem] sm:right-[-2rem]"
					style={{ minWidth: `${Math.min(imgWidth, window.innerWidth)}px` }}
				/>
			)*/}
      <AbilityScore
        canEdit={canEdit}
        abilityScore={abilityScores.strength}
        updateAttribute={(attr) => {
          setAbilityScores((prev) => {
            const newValue: AbilityScores = { ...prev, strength: attr };
            debounceModifyAbilityScores(newValue);
            return newValue;
          });
        }}
        name={"Strength"}
      />
      <AbilityScore
        canEdit={canEdit}
        abilityScore={abilityScores.dexterity}
        updateAttribute={(attr) => {
          setAbilityScores((prev) => {
            const newValue: AbilityScores = { ...prev, dexterity: attr };
            debounceModifyAbilityScores(newValue);
            return newValue;
          });
        }}
        name={"Dexterity"}
      />
      <AbilityScore
        canEdit={canEdit}
        abilityScore={abilityScores.constitution}
        updateAttribute={(attr) => {
          setAbilityScores((prev) => {
            const newValue: AbilityScores = { ...prev, constitution: attr };
            debounceModifyAbilityScores(newValue);
            return newValue;
          });
        }}
        name={"Constitution"}
      />
      <AbilityScore
        canEdit={canEdit}
        abilityScore={abilityScores.intelligence}
        updateAttribute={(attr) => {
          setAbilityScores((prev) => {
            const newValue: AbilityScores = { ...prev, intelligence: attr };
            debounceModifyAbilityScores(newValue);
            return newValue;
          });
        }}
        name={"Intelligence"}
      />
      <AbilityScore
        canEdit={canEdit}
        abilityScore={abilityScores.wisdom}
        updateAttribute={(attr) => {
          setAbilityScores((prev) => {
            const newValue: AbilityScores = { ...prev, wisdom: attr };
            debounceModifyAbilityScores(newValue);
            return newValue;
          });
        }}
        name={"Wisdom"}
      />
      <AbilityScore
        canEdit={canEdit}
        abilityScore={abilityScores.charisma}
        updateAttribute={(attr) => {
          setAbilityScores((prev) => {
            const newValue: AbilityScores = { ...prev, charisma: attr };
            debounceModifyAbilityScores(newValue);
            return newValue;
          });
        }}
        name={"Charisma"}
      />
    </div>
  );
};

export default AbilitScoresComp;
