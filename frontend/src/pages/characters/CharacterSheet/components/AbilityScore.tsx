import type React from "react";
import { memo, useEffect, useState } from "react";
import type { Attribute } from "../../../../types/characterData";

const UnstyledNumberInput: React.FC<{
	value: string;
	onChange: (val: string) => void;
	className?: string;
	style?: React.CSSProperties;
}> = ({ value, onChange, className, style }) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newValue = e.target.value;

		// Regular expression to allow only one leading sign (+ or -)
		newValue = newValue.replace(/[^-+\d]/g, "");

		// Ensure that only the first character can be a sign (+ or -)
		newValue = newValue.replace(/(?!^)[-+]/g, "");

		onChange(newValue);
	};

	return (
		<input
			type="text"
			value={value}
			onChange={handleChange}
			style={style}
			className={`outline-none p-0 m-0 ${className}`}
		/>
	);
};
const AbilityScore: React.FC<{
	attribute: Attribute;
	name: string;
	updateAttribute: (attr: Attribute) => void;
}> = ({ attribute, name, updateAttribute }) => {
	const [score, setScore] = useState<{ value: string; modifier: string }>({
		value: attribute.value.toString(),
		modifier: attribute.modifier.toString(),
	});
	const [trueModifier, setTrueModifier] = useState<number>(0);

	useEffect(() => {
		setTrueModifier(
			Math.floor((attribute.value - 10) / 2) + attribute.modifier,
		);
		setScore({
			value: attribute.value.toString(),
			modifier: attribute.modifier.toString(),
		});
	}, [attribute]);

	const onScoreUpdate = (updatedScore: { value: string; modifier: string }) => {
		if (updatedScore.value === "" || updatedScore.modifier === "") {
			return;
		}
		const val = Number.parseInt(updatedScore.value);
		const mod = Number.parseInt(updatedScore.modifier);
		if (!Number.isNaN(val) && !Number.isNaN(mod)) {
			setTrueModifier(Math.floor((val - 10) / 2) + mod);
			if (val !== attribute.value || mod !== attribute.modifier) {
				updateAttribute({ value: val, modifier: mod });
			}
		}
	};

	return (
		<div
			className="border-2 border-shadow-black bg-light-parchment-beiage 
                rounded-3xl relative aspect-[5/6]
                w-1/4 lg:w-[15%] xl:w-[10%] 2xl:w-[8%]
                pb-10
                flex flex-col justify-start items-center"
		>
			<span
				className="justify-self-start font-bold pt-2 
                        text-xs sm:text-xl lg:text-base xl:text-base
                        "
			>
				{name}
			</span>
			<UnstyledNumberInput
				className="outline-none w-full bg-light-parchment-beiage text-center 
text-3xl sm:text-5xl xl:text-5xl grow"
				onChange={(val) => {
					setScore((prevScore) => {
						const updatedScore = { value: val, modifier: prevScore.modifier };
						setTimeout(() => onScoreUpdate(updatedScore), 0);
						return updatedScore;
					});
				}}
				value={score.value}
			/>
			<div className="w-full h-auto flex flex-col items-center bottom-0 translate-y-1/4 absolute">
				<UnstyledNumberInput
					className="w-1/3 aspect-[2/1] 
                        bg-light-parchment-beiage 
                        border-2 border-shadow-black
                        rounded-md 
                        text-center"
					onChange={(mod) => {
						setScore((prevScore) => {
							const updatedScore = { value: prevScore.value, modifier: mod };
							setTimeout(() => onScoreUpdate(updatedScore), 0);
							return updatedScore;
						});
					}}
					value={score.modifier}
				/>
				<div
					className="border-2 font-bold border-shadow-black rounded-full 
                                flex items-center justify-center
                                md:text-2xl lg:text-base
                                w-1/2 aspect-[2/1]  bg-light-parchment-beiage text-center"
				>
					{trueModifier}
				</div>
			</div>
		</div>
	);
};

export default memo(AbilityScore);
