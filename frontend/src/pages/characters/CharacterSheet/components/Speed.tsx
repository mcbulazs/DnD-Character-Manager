import type React from "react";
import { useCallback } from "react";
import UnstyledNumberInput from "../../../../components/UnstyledNumberInput";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import debounce from "../../../../utility/debounce";
const Speed: React.FC<{
  value: number;
  characterID: number;
  disabled?: boolean;
}> = ({ value, characterID, disabled = false }) => {
  const [setSpeed] = useSetCharacterAttributeMutation();
  const debouncedSetSpeed = useCallback(
    debounce((speed: number) => {
      setSpeed({ data: { speed }, id: characterID });
    }, 300),
    [],
  );
  return (
    <div className="w-full h-full flex flex-col items-center justify-evenly">
      <span className="text-sm text-center w-full font-bold">Speed</span>
      <div className="w-2/3 aspect-square flex     items-center justify-center border-4 border-black rounded-3xl bg-light-parchment-beige">
        <UnstyledNumberInput
          disabled={disabled}
          defaultValue={value}
          onChange={(val) => {
            debouncedSetSpeed(val);
          }}
          className="text-5xl w-full text-center bg-transparent"
        />
      </div>
    </div>
  );
};

export default Speed;
