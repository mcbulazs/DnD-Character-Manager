import type React from "react";
import { useCallback, useState } from "react";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import debounce from "../../../../utility/debounce";

const CharacterName: React.FC<{
  name: string;
  characterID: number;
  disabled?: boolean;
}> = ({ name, characterID, disabled = false }) => {
  console.log(disabled);
  const [characterName, setCharacterName] = useState<string>(name);
  const [setName] = useSetCharacterAttributeMutation();

  const debouncedSetName = useCallback(
    debounce((name: string) => {
      setName({ data: { name }, id: characterID });
    }, 300),
    [],
  );

  return (
    <div className="bg-light-parchment-beige border-4 border-black rounded-xl w-full">
      <span className="">Character Name:</span>
      <input
        disabled={disabled}
        className="w-full bg-transparent text-center text-2xl outline-none"
        value={characterName}
        onChange={(e) => {
          setCharacterName(e.target.value);
          debouncedSetName(e.target.value);
        }}
      />
    </div>
  );
};

export default CharacterName;
