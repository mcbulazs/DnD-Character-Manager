import type React from "react";
import { useCallback, useState } from "react";
import UnstyledNumberInput from "../../../../components/UnstyledNumberInput";
import { useSetCharacterAttributeMutation } from "../../../../store/api/characterApiSlice";
import debounce from "../../../../utility/debounce";

const ArmorClass: React.FC<{ armorClass: number; characterID: number }> = ({
	armorClass,
	characterID,
}) => {
	const [ac, setAc] = useState<string>(armorClass.toString());

	const [setArmorClass] = useSetCharacterAttributeMutation();
	const debouncedSetArmorClass = useCallback(
		debounce((ac: number) => {
			setArmorClass({ data: { armorClass: ac }, id: characterID });
		}, 300),
		[],
	);

	return (
		<div className="w-full aspect-square flex flex-col items-center justify-center border-4 border-black rounded-b-full bg-light-parchment-beiage">
			<span className="text-sm font-bold">Armor Class</span>
			<UnstyledNumberInput
				value={ac}
				onChange={(val) => {
					setAc(val);
					if (val !== "" && !Number.isNaN(Number.parseInt(val))) {
						debouncedSetArmorClass(Number.parseInt(val));
					}
				}}
				className="text-5xl w-11/12 text-center bg-transparent"
			/>
		</div>
	);
};

export default ArmorClass;
