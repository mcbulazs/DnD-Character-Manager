import type React from "react";
import { useCallback, useState } from "react";
import UnstyledNumberInput from "../../../../components/UnstyledNumberInput";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import debounce from "../../../../utility/debounce";

const CharacterLevel: React.FC<{ level: number; characterID: number }> = ({
	level,
	characterID,
}) => {
	const [levelValue, setLevelValue] = useState<string>(level.toString());
	const [setCharacterLevel] = useSetCharacterAttributeMutation();

	const debouncedSetCharacterLevel = useCallback(
		debounce((val: number) => {
			setCharacterLevel({ data: { level: val }, id: characterID });
		}, 300),
		[],
	);
	return (
		<div className="h-full row-span-2 flex flex-col justify-center items-end">
			<span className="font-bold">Character Level:</span>
			<div
				className="bg-light-parchment-beiage border-4 border-black rounded-xl aspect-square w-2/3 
                    flex items-center justify-center
                    relative"
			>
				<UnstyledNumberInput
					value={levelValue}
					onChange={(val) => {
						setLevelValue(val);
						if (val !== "" && !Number.isNaN(Number.parseInt(val))) {
							debouncedSetCharacterLevel(Number.parseInt(val));
						}
					}}
					className="w-full bg-transparent text-center text-5xl"
				/>
				<div
					className="absolute bottom-0 bg-forest-green w-full rounded-full border-2 border-black text-center 
                    cursor-pointer translate-y-1/2 select-none whitespace-nowrap"
				>
					{String.fromCodePoint(0x10323)} Level Up{" "}
					{String.fromCodePoint(0x10323)}
				</div>
			</div>
		</div>
	);
};

export default CharacterLevel;
