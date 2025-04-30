import InfoIcon from "@mui/icons-material/Info";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SavingThrowInfo from "/publicfile_SavingThrowInfo.png";
import { useModifyCharacterSavingThrowsMutation } from "../../../../../store/api/characterApiSlice";
import type {
  AbilityScores,
  SavingThrows,
} from "../../../../../types/characterData";
import debounce from "../../../../../utility/debounce";
import SavingThrow from "./SavingThrow";

const SavingThrowsComp: React.FC<{
  savingThrows: SavingThrows;
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  characterID: number;
  canEdit: boolean;
}> = ({
  savingThrows: _savingThrows,
  abilityScores,
  proficiencyBonus,
  characterID,
  canEdit,
}) => {
    const [savingThrows, setSavingThrows] = useState<SavingThrows>(_savingThrows);
    const [modifyCharacterSavingThrowsMutation] =
      useModifyCharacterSavingThrowsMutation();
    const [isHovered, setIsHovered] = useState(false);
    const [imgWidth, setImgWidth] = useState(0);

    useEffect(() => {
      setSavingThrows(_savingThrows);
    }, [_savingThrows]);

    useEffect(() => {
      const img = new Image();
      img.src = SavingThrowInfo;
      img.onload = () => {
        setImgWidth(img.width);
      };
    }, []);

    const debounceModifySavingThrows = useCallback(
      debounce(async (savingThrows: SavingThrows) => {
        try {
          modifyCharacterSavingThrowsMutation({
            savingThrows,
            characterID,
          }).unwrap();
        } catch (error) {
          toast("Error updating saving throws", { type: "error" });
          console.error("Error updating saving throws", error);
        }
      }, 300),
      [],
    );

    return (
      <div className="w-auto h-fit border-4 border-black rounded-xl p-2 relative bg-light-parchment-beige">
        {/*
        <div
          className="absolute right-0 top-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <InfoIcon />
        </div>
        isHovered && (
				<img
					src={SavingThrowInfo}
					alt="Saving Throw Info"
					className="absolute mt-5 border-4 border-black rounded-lg z-50 right-[-1.2rem]"
                    style={{ minWidth: imgWidth }}
				/>
			)*/}
        <table className="text-md xl:text-xl">
          <tbody>
            <SavingThrow
              disabled={!canEdit}
              savingThrow={savingThrows.strength}
              updateSavingThrow={(savingThrow) => {
                setSavingThrows((prev) => {
                  const newValue: SavingThrows = {
                    ...prev,
                    strength: savingThrow,
                  };
                  debounceModifySavingThrows(newValue);
                  return newValue;
                });
              }}
              name={"Strength"}
              abilityScore={abilityScores.strength}
              proficiencyBonus={proficiencyBonus}
            />
            <SavingThrow
              disabled={!canEdit}
              savingThrow={savingThrows.dexterity}
              updateSavingThrow={(savingThrow) => {
                setSavingThrows((prev) => {
                  const newValue: SavingThrows = {
                    ...prev,
                    dexterity: savingThrow,
                  };
                  debounceModifySavingThrows(newValue);
                  return newValue;
                });
              }}
              name={"Dexterity"}
              abilityScore={abilityScores.dexterity}
              proficiencyBonus={proficiencyBonus}
            />
            <SavingThrow
              disabled={!canEdit}
              savingThrow={savingThrows.constitution}
              updateSavingThrow={(savingThrow) => {
                setSavingThrows((prev) => {
                  const newValue: SavingThrows = {
                    ...prev,
                    constitution: savingThrow,
                  };
                  debounceModifySavingThrows(newValue);
                  return newValue;
                });
              }}
              name={"Constitution"}
              abilityScore={abilityScores.constitution}
              proficiencyBonus={proficiencyBonus}
            />
            <SavingThrow
              disabled={!canEdit}
              savingThrow={savingThrows.intelligence}
              updateSavingThrow={(savingThrow) => {
                setSavingThrows((prev) => {
                  const newValue: SavingThrows = {
                    ...prev,
                    intelligence: savingThrow,
                  };
                  debounceModifySavingThrows(newValue);
                  return newValue;
                });
              }}
              name={"Intelligence"}
              abilityScore={abilityScores.intelligence}
              proficiencyBonus={proficiencyBonus}
            />
            <SavingThrow
              disabled={!canEdit}
              savingThrow={savingThrows.wisdom}
              updateSavingThrow={(savingThrow) => {
                setSavingThrows((prev) => {
                  const newValue: SavingThrows = { ...prev, wisdom: savingThrow };
                  debounceModifySavingThrows(newValue);
                  return newValue;
                });
              }}
              name={"Wisdom"}
              abilityScore={abilityScores.wisdom}
              proficiencyBonus={proficiencyBonus}
            />
            <SavingThrow
              disabled={!canEdit}
              savingThrow={savingThrows.charisma}
              updateSavingThrow={(savingThrow) => {
                setSavingThrows((prev) => {
                  const newValue: SavingThrows = {
                    ...prev,
                    charisma: savingThrow,
                  };
                  debounceModifySavingThrows(newValue);
                  return newValue;
                });
              }}
              name={"Charisma"}
              abilityScore={abilityScores.charisma}
              proficiencyBonus={proficiencyBonus}
            />
          </tbody>
        </table>
      </div>
    );
  };

export default SavingThrowsComp;
