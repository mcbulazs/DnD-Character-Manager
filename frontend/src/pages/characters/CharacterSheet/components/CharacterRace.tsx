import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import debounce from "../../../../utility/debounce";

const CharacterRace: React.FC<{
  race: string;
  characterID: number;
  disabled?: boolean;
}> = ({ race, characterID, disabled = false }) => {
  const [raceValue, setRaceValue] = useState<string>(race);
  const [setCharacterRace] = useSetCharacterAttributeMutation();
  useEffect(() => {
    setRaceValue(race);
  }, [race]);

  const debouncedSetCharacterRace = useCallback(
    debounce((val: string) => {
      setCharacterRace({ data: { race: val }, id: characterID });
    }, 300),
    [],
  );
  return (
    <div className="bg-light-parchment-beige border-4 border-black rounded-xl">
      <span className="">Character Race:</span>
      <input
        disabled={disabled}
        className="w-full bg-transparent text-center text-2xl outline-none"
        value={raceValue}
        onChange={(e) => {
          setRaceValue(e.target.value);
          debouncedSetCharacterRace(e.target.value);
        }}
      />
    </div>
  );
};

export default CharacterRace;
