import type React from "react";
import { useCallback, useState } from "react";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import debounce from "../../../../utility/debounce";

const CharacterName: React.FC<{ name: string; characterID: number }> = ({
	name,
	characterID,
}) => {
	const [characterName, setCharacterName] = useState<string>(name);
	const [setName] = useSetCharacterAttributeMutation();

	const debouncedSetName = useCallback(
		debounce((name: string) => {
			setName({ data: { name }, id: characterID });
		}, 300),
		[],
	);

	return (
		<div className="bg-light-parchment-beiage border-4 border-black rounded-xl w-full col-span-2">
			<span className="">Character Name:</span>
			<input
				className="w-full bg-transparent text-center text-2xl"
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