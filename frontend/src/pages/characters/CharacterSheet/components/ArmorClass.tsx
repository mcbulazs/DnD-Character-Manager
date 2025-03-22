import type React from "react";
import { useCallback } from "react";
import UnstyledNumberInput from "../../../../components/UnstyledNumberInput";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import debounce from "../../../../utility/debounce";

const ArmorClass: React.FC<{
  value: number;
  characterID: number;
  disabled?: boolean;
}> = ({ value, characterID, disabled = false }) => {
  const [setArmorClass] = useSetCharacterAttributeMutation();
  const debouncedSetArmorClass = useCallback(
    debounce((ac: number) => {
      setArmorClass({ data: { armorClass: ac }, id: characterID });
    }, 300),
    [],
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-evenly">
      <span className="text-sm text-center w-full font-bold">Armor Class</span>
      <div className="w-2/3 aspect-square flex items-center justify-center border-4 border-black rounded-b-full bg-light-parchment-beige">
        <UnstyledNumberInput
          disabled={disabled}
          defaultValue={value}
          onChange={(val) => {
            debouncedSetArmorClass(val);
          }}
          className="text-5xl w-full text-center bg-transparent"
        />
      </div>
    </div>
  );
};

export default ArmorClass;
