import type React from "react";
import { useEffect, useState } from "react";
import UnstyledNumberInput from "../../../../../components/UnstyledNumberInput";
import type {
  Attribute,
  ExpertiseAttribute,
} from "../../../../../types/characterData";
import RotationCircle from "../RotatingBox";

const Skill: React.FC<{
  canEdit: boolean;
  skill: ExpertiseAttribute;
  name: string;
  type: string;
  abilityScore: Attribute;
  proficiencyBonus: number;
  updateSkill: (attr: ExpertiseAttribute) => void;
}> = ({
  skill,
  name,
  type,
  abilityScore,
  proficiencyBonus,
  updateSkill,
  canEdit,
}) => {
    const [modifier, setModifier] = useState<number>(skill.modifier);
    const [trueModifier, setTrueModifier] = useState<number>(0);
    const [profRotation, setProfRotation] = useState<number>(0);
    useEffect(() => {
      setTrueModifier(
        Math.floor((abilityScore.value - 10) / 2) +
        abilityScore.modifier +
        skill.modifier +
        (skill.expertise
          ? 2 * proficiencyBonus
          : skill.proficient
            ? proficiencyBonus
            : 0),
      );
      setModifier(skill.modifier);
      setProfRotation(skill.expertise ? 2 : skill.proficient ? 1 : 0);
    }, [abilityScore, skill, proficiencyBonus]);

    const onSkillUpdate = (updatedSkill: {
      modifier: number;
      rotation: number;
    }) => {
      const mod = updatedSkill.modifier;
      if (Number.isNaN(mod)) {
        return;
      }
      setTrueModifier(
        Math.floor((abilityScore.value - 10) / 2) +
        abilityScore.modifier +
        updatedSkill.modifier +
        updatedSkill.rotation * proficiencyBonus,
      );
      updateSkill({
        modifier: updatedSkill.modifier,
        proficient: updatedSkill.rotation === 1,
        expertise: updatedSkill.rotation === 2,
      });
    };

    return (
      <tr>
        {/*true modifier*/}
        <td className="text-center font-bold pr-2">
          <span>{trueModifier}</span>
        </td>
        {/*proficiency/expertise*/}
        <td className="text-center">
          <RotationCircle
            disabled={!canEdit}
            profRotation={profRotation}
            setProfRotation={(val) => {
              setProfRotation(val);
              onSkillUpdate({ modifier, rotation: val });
            }}
            max={3}
          />
        </td>
        {/*modifier*/}
        <td className="text-center">
          <UnstyledNumberInput
            disabled={!canEdit}
            defaultValue={modifier}
            onChange={(val) => {
              setModifier(val);
              onSkillUpdate({ modifier: val, rotation: profRotation });
            }}
            className="bg-light-parchment-beige w-8 text-center"
          />
        </td>
        <td className=" whitespace-nowrap">
          {/*name*/}
          <span>{name}</span>
          {/*type*/}
          <span className="text-gray-500"> ({type})</span>
        </td>
      </tr>
    );
  };

export default Skill;
