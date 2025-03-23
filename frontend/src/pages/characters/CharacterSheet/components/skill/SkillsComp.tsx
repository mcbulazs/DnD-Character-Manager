import InfoIcon from "@mui/icons-material/Info";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SkillInfo from "/publicfile_SkillInfo.png";
import { useModifyCharacterSkillsMutation } from "../../../../../store/api/characterApiSlice";
import type { AbilityScores, Skills } from "../../../../../types/characterData";
import debounce from "../../../../../utility/debounce";
import Skill from "./Skill";

const SkillsComp: React.FC<{
  skills: Skills;
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  characterID: number;
  canEdit: boolean;
}> = ({
  skills: _skills,
  abilityScores,
  proficiencyBonus,
  characterID,
  canEdit,
}) => {
    const [skills, setSkills] = useState<Skills>(_skills);
    const [modifyCharacterSkillsMutation] = useModifyCharacterSkillsMutation();
    const [isHovered, setIsHovered] = useState(false);
    const [imgWidth, setImgWidth] = useState(0);

    useEffect(() => {
      setSkills(_skills);
    }, [_skills]);
    useEffect(() => {
      const img = new Image();
      img.src = SkillInfo;
      img.onload = () => {
        setImgWidth(img.width);
      };
    }, []);

    const debounceModifySkills = useCallback(
      debounce(async (skills: Skills) => {
        try {
          modifyCharacterSkillsMutation({
            skills,
            characterID,
          }).unwrap();
        } catch (error) {
          toast("Error updating skills", { type: "error" });
          console.error("Error updating skills", error);
        }
      }, 300),
      [],
    );
    return (
      <div className="w-full h-auto border-4 border-black rounded-xl p-2 relative bg-light-parchment-beige">
        <div
          className="absolute right-0 top-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <InfoIcon />
        </div>
        {/*isHovered && (
                <img
                    src={SkillInfo}
                    alt="Skills Info"
                    className="absolute mt-5 border-4 border-black rounded-lg z-50 right-[-2rem]"
                    style={{ minWidth: imgWidth }}
                />
            )*/}
        <table className="text-md xl:text-xl">
          <tbody>
            <Skill
              canEdit={canEdit}
              skill={skills?.acrobatics ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, acrobatics: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Acrobatics"}
              type={"dex"}
              abilityScore={abilityScores.dexterity}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.animalHandling ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, animalHandling: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Animal Handling"}
              type={"wis"}
              abilityScore={abilityScores.wisdom}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.arcana ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, arcana: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Arcana"}
              type={"int"}
              abilityScore={abilityScores.intelligence}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.athletics ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, athletics: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Athletics"}
              type={"str"}
              abilityScore={abilityScores.strength}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.deception ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, deception: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Deception"}
              type={"cha"}
              abilityScore={abilityScores.charisma}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.history ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, history: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"History"}
              type={"int"}
              abilityScore={abilityScores.intelligence}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.insight ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, insight: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Insight"}
              type={"wis"}
              abilityScore={abilityScores.wisdom}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.intimidation ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, intimidation: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Intimidation"}
              type={"cha"}
              abilityScore={abilityScores.charisma}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.investigation ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, investigation: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Investigation"}
              type={"int"}
              abilityScore={abilityScores.intelligence}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.medicine ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, medicine: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Medicine"}
              type={"wis"}
              abilityScore={abilityScores.wisdom}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.nature ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, nature: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Nature"}
              type={"int"}
              abilityScore={abilityScores.intelligence}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.perception ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, perception: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Perception"}
              type={"wis"}
              abilityScore={abilityScores.wisdom}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.performance ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, performance: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Performance"}
              type={"cha"}
              abilityScore={abilityScores.charisma}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.persuasion ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, persuasion: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Persuasion"}
              type={"cha"}
              abilityScore={abilityScores.charisma}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.religion ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, religion: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Religion"}
              type={"int"}
              abilityScore={abilityScores.intelligence}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.sleightOfHand ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, sleightOfHand: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Sleight of Hand"}
              type={"dex"}
              abilityScore={abilityScores.dexterity}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.stealth ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, stealth: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Stealth"}
              type={"dex"}
              abilityScore={abilityScores.dexterity}
              proficiencyBonus={proficiencyBonus}
            />
            <Skill
              canEdit={canEdit}
              skill={skills?.survival ?? { value: 0, modifier: 0 }}
              updateSkill={(skill) => {
                setSkills((prev) => {
                  const newValue: Skills = { ...prev, survival: skill };
                  debounceModifySkills(newValue);
                  return newValue;
                });
              }}
              name={"Survival"}
              type={"wis"}
              abilityScore={abilityScores.wisdom}
              proficiencyBonus={proficiencyBonus}
            />
          </tbody>
        </table>
      </div>
    );
  };

export default SkillsComp;
