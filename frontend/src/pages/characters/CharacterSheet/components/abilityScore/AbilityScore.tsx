import type React from "react";
import { useEffect, useState } from "react";
import UnstyledNumberInput from "../../../../../components/UnstyledNumberInput";
import type { Attribute } from "../../../../../types/characterData";

const AbilityScore: React.FC<{
  abilityScore: Attribute;
  name: string;
  updateAttribute: (attr: Attribute) => void;
  canEdit: boolean;
}> = ({ abilityScore, name, updateAttribute, canEdit }) => {
  const [score, setScore] = useState<{ value: number; modifier: number }>({
    value: abilityScore.value,
    modifier: abilityScore.modifier,
  });
  const [trueModifier, setTrueModifier] = useState<number>(0);

  useEffect(() => {
    setTrueModifier(
      Math.floor((abilityScore.value - 10) / 2) + abilityScore.modifier,
    );
    setScore({ value: abilityScore.value, modifier: abilityScore.modifier });
  }, [abilityScore]);

  const onScoreUpdate = (updatedScore: { value: number; modifier: number }) => {
    const val = updatedScore.value;
    const mod = updatedScore.modifier;
    if (!Number.isNaN(val) && !Number.isNaN(mod)) {
      setTrueModifier(Math.floor((val - 10) / 2) + mod);
      if (val !== abilityScore.value || mod !== abilityScore.modifier) {
        updateAttribute({ value: val, modifier: mod });
      }
    }
  };

  return (
    <div
      className="border-2 border-shadow-black bg-light-parchment-beige 
                rounded-3xl 2xl:rounded-[2.5rem] relative aspect-[5/6]
                w-full
                pb-10
                flex flex-col justify-start items-center
                shadow-black shadow-md"
    >
      <span
        className="justify-self-start font-bold pt-2 
                        text-xs sm:text-base"
      >
        {name}
      </span>

      <div
        className="outline-none w-full bg-transparent text-center 
text-5xl
grow flex justify-center items-center"
      >
        {trueModifier}
      </div>
      <div className="w-full h-auto flex flex-col items-center bottom-0 translate-y-1/4 absolute">
        <UnstyledNumberInput
          className="w-1/3 aspect-[2/1] 
                        bg-transparent 
                        border-2 border-shadow-black
                        rounded-md 
                        text-center"
          disabled={!canEdit}
          onChange={(mod) => {
            setScore((prevScore) => {
              const updatedScore = { value: prevScore.value, modifier: mod };
              setTimeout(() => onScoreUpdate(updatedScore), 0);
              return updatedScore;
            });
          }}
          defaultValue={score.modifier}
        />

        <UnstyledNumberInput
          className="border-2 font-bold border-shadow-black rounded-full 
                      flex items-center justify-center
                      w-1/2 aspect-[2/1]  bg-light-parchment-beige text-center"
          disabled={!canEdit}
          onChange={(val) => {
            setScore((prevScore) => {
              const updatedScore = { value: val, modifier: prevScore.modifier };
              setTimeout(() => onScoreUpdate(updatedScore), 0);
              return updatedScore;
            });
          }}
          defaultValue={score.value}
        />
      </div>
    </div>
  );
};

export default AbilityScore;
