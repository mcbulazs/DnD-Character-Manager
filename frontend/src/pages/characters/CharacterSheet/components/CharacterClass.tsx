import type React from "react";
import { useCallback, useState } from "react";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import debounce from "../../../../utility/debounce";

const CharacterClass: React.FC<{
	characterClass: string;
	characterID: number;
}> = ({ characterClass, characterID }) => {
	const [classValue, setClassValue] = useState<string>(characterClass);
	const [setCharacterClass] = useSetCharacterAttributeMutation();

	const debouncedSetCharacterClass = useCallback(
		debounce((val: string) => {
			setCharacterClass({ data: { class: val }, id: characterID });
		}, 300),
		[],
	);

	return (
		<div className="bg-light-parchment-beiage border-4 border-black rounded-xl">
			<span className="">Character Class:</span>
			<input
				className="w-full bg-transparent text-center text-2xl"
				value={classValue}
				onChange={(e) => {
					setClassValue(e.target.value);
					debouncedSetCharacterClass(e.target.value);
				}}
			/>
		</div>
	);
};

export default CharacterClass;