import type React from "react";
import { useCallback } from "react";
import UnstyledNumberInput from "../../../../components/UnstyledNumberInput";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import debounce from "../../../../utility/debounce";

const ProficiencyBonus: React.FC<{
  value: number;
  characterId: number;
}> = ({ value, characterId }) => {
  const [setProficiencyBonus] = useSetCharacterAttributeMutation();
  const debouncedSetProficiencyBonus = useCallback(
    debounce((proficiencyBonus: number) => {
      setProficiencyBonus({ data: { proficiencyBonus }, id: characterId });
    }, 300),
    [],
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-evenly">
      <span className="text-sm text-center w-full font-bold">
        Proficiency Bonus
      </span>
      <div className="w-3/5 aspect-square flex items-center justify-center relative">
        <div className="absolute w-full aspect-square rotate-45 bg-light-parchment-beige border-4 border-black rounded-3xl " />
        <UnstyledNumberInput
          defaultValue={value}
          onChange={(val) => {
            debouncedSetProficiencyBonus(val);
          }}
          className="text-5xl w-full text-center bg-transparent z-10"
        />
      </div>
    </div>
  );
};

export default ProficiencyBonus;
