import type React from "react";
import { useCallback, useState } from "react";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import debounce from "../../../../utility/debounce";

const CharacterRace: React.FC<{ race: string; characterID: number }> = ({
	race,
	characterID,
}) => {
	const [raceValue, setRaceValue] = useState<string>(race);
	const [setCharacterRace] = useSetCharacterAttributeMutation();

	const debouncedSetCharacterRace = useCallback(
		debounce((val: string) => {
			setCharacterRace({ data: { race: val }, id: characterID });
		}, 300),
		[],
	);
	return (
		<div className="bg-light-parchment-beiage border-4 border-black rounded-xl">
			<span className="">Character Race:</span>
			<input
				className="w-full bg-transparent text-center text-2xl"
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