import type React from "react";
import { useCallback, useEffect, useState } from "react";
import UnstyledNumberInput from "../../../../components/UnstyledNumberInput";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import type { Attribute } from "../../../../types/characterData";
import debounce from "../../../../utility/debounce";

const Initiative: React.FC<{
  value: number;
  characterId: number;
  dexterity: Attribute;
}> = ({ value, characterId, dexterity }) => {
  const [setInitiative] = useSetCharacterAttributeMutation();
  const [trueModifier, setTrueModifier] = useState<number>(0);

  useEffect(() => {
    setTrueModifier(
      Math.floor((dexterity.value - 10) / 2) + dexterity.modifier + value,
    );
  }, [dexterity, value]);

  const debouncedSetInitiative = useCallback(
    debounce((initiative: number) => {
      setInitiative({ data: { initiative }, id: characterId });
    }, 300),
    [],
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-evenly">
      <span className="text-sm text-center w-full font-bold">Initiative</span>
      <div
        className="w-2/3 aspect-square  
                border-4 border-black rounded-3xl
                bg-light-parchment-beige
                relative
                flex flex-col items-center justify-center"
      >
        <span className="text-5xl w-full text-center bg-transparent">
          {trueModifier}
        </span>
        <UnstyledNumberInput
          defaultValue={value}
          onChange={(val) => {
            setTrueModifier(
              Math.floor((dexterity.value - 10) / 2) + dexterity.modifier + val,
            );
            debouncedSetInitiative(val);
          }}
          className="text-center text-lg 
                    bg-light-parchment-beige border-2 border-black 
                    w-1/2 rounded-md translate-y-1/2 bottom-0 absolute"
        />
      </div>
    </div>
  );
};

export default Initiative;
