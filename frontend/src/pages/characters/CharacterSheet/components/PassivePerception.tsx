import type React from "react";
import { useCallback, useEffect, useState } from "react";
import UnstyledNumberInput from "../../../../components/UnstyledNumberInput";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import type {
  Attribute,
  ExpertiseAttribute,
} from "../../../../types/characterData";
import debounce from "../../../../utility/debounce";

const PassivePerception: React.FC<{
  value: number;
  wisdom: Attribute;
  perception: ExpertiseAttribute;
  characterId: number;
  proficiencyBonus: number;
}> = ({ value, wisdom, perception, characterId, proficiencyBonus }) => {
  const [trueModifier, setTrueModifier] = useState<number>(0);
  const [setPassivePerception] = useSetCharacterAttributeMutation();

  useEffect(() => {
    setTrueModifier(
      10 +
      Math.floor((wisdom.value - 10) / 2) +
      wisdom.modifier +
      value +
      (perception.expertise ? 2 : perception.proficient ? 1 : 0) *
      proficiencyBonus,
    );
  }, [wisdom, value, perception, proficiencyBonus]);

  const debouncedSetPassivePerception = useCallback(
    debounce((passivePerception: number) => {
      setPassivePerception({ data: { passivePerception }, id: characterId });
    }, 300),
    [],
  );

  return (
    <div
      className="h-9 w-4/5 flex flex-row items-center justify-end 
                    bg-light-parchment-beige border-r-4 border-y-4 border-black rounded-r-3xl
                    pl-9 pr-2
                    ml-[1.5rem]
                    relative"
    >
      <div
        className="rounded-full h-10 bg-light-parchment-beige border-4 border-black aspect-square box-content
                    absolute left-[-1.5rem] flex justify-center items-center text-2xl"
      >
        {trueModifier}
      </div>
      <UnstyledNumberInput
        defaultValue={value}
        onChange={(val) => {
          setTrueModifier(
            10 +
            Math.floor((wisdom.value - 10) / 2) +
            wisdom.modifier +
            val +
            (perception.expertise ? 2 : perception.proficient ? 1 : 0) *
            proficiencyBonus,
          );
          debouncedSetPassivePerception(val);
        }}
        className="text-2xl bg-transparent w-full"
      />
      <span className="text-sm text-center w-fit font-bold whitespace-nowrap">
        Passive Perception
      </span>
    </div>
  );
};

export default PassivePerception;
