import { useEffect, useState } from "react";
import UnstyledNumberInput from "../../../../../components/UnstyledNumberInput";
import type {
	Attribute,
	ProficientAttribute,
} from "../../../../../types/characterData";
import RotationCircle from "../RotatingBox";

const SavingThrow: React.FC<{
	savingThrow: ProficientAttribute;
	name: string;
	abilityScore: Attribute;
	proficiencyBonus: number;
	updateSavingThrow: (attr: ProficientAttribute) => void;
}> = ({
	savingThrow,
	name,
	updateSavingThrow,
	abilityScore,
	proficiencyBonus,
}) => {
	const [modifier, setModifier] = useState<string>(
		savingThrow.modifier.toString(),
	);
	const [trueModifier, setTrueModifier] = useState<number>(0);
	const [profficiency, setProfficiency] = useState<boolean>(false);

	useEffect(() => {
		setTrueModifier(
			Math.floor((abilityScore.value - 10) / 2) +
				abilityScore.modifier +
				savingThrow.modifier +
				(savingThrow.proficient ? proficiencyBonus : 0),
		);
		setModifier(savingThrow.modifier.toString());
        setProfficiency(savingThrow.proficient);
	}, [abilityScore, savingThrow, proficiencyBonus]);

	const onSavingThrowUpdate = (updatedSavingThrow: {
		modifier: string;
		prof: boolean;
	}) => {
		if (updatedSavingThrow.modifier === "") {
			return;
		}
		const mod = Number.parseInt(updatedSavingThrow.modifier);
		if (Number.isNaN(mod)) {
			return;
		}
		setTrueModifier(
			Math.floor((abilityScore.value - 10) / 2) +
				abilityScore.modifier +
				Number.parseInt(updatedSavingThrow.modifier) +
				(updatedSavingThrow.prof ? proficiencyBonus : 0),
		);
		updateSavingThrow({
			modifier: Number.parseInt(updatedSavingThrow.modifier),
			proficient: updatedSavingThrow.prof,
		});
	};

	return (
		<tr>
			{/*true modifier*/}
			<td className="text-center font-bold pr-2">
				<span>{trueModifier}</span>
			</td>
			{/*proficiency/expertise*/}
			<td className="text-center">
				<RotationCircle
					profRotation={profficiency ? 1 : 0}
					setProfRotation={(val) => {
						setProfficiency(val === 1);
						onSavingThrowUpdate({ modifier, prof: val === 1 });
					}}
					max={2}
				/>
			</td>
			{/*modifier*/}
			<td className="text-center">
				<UnstyledNumberInput
					value={modifier}
					onChange={(val) => {
						setModifier(val);
						onSavingThrowUpdate({ modifier: val, prof: profficiency });
					}}
					className="bg-light-parchment-beiage w-8 text-center"
				/>
			</td>
			<td>
				{/*name*/}
				<span>{name}</span>
			</td>
		</tr>
	);
};

export default SavingThrow;