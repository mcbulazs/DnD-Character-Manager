import InfoIcon from "@mui/icons-material/Info";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AbilityScoreInfo from "/publicfile_AbilityScoreInfo.png";
import { useModifyCharacterAbilityScoresMutation } from "../../../../../store/api/characterApiSlice";
import type { AbilityScores } from "../../../../../types/characterData";
import debounce from "../../../../../utility/debounce";
import AbilityScore from "./AbilityScore";

const AbilitScoresComp: React.FC<{
	abilityScores: AbilityScores;
	characterID: number;
}> = ({ abilityScores: _abilityScores, characterID }) => {
	const [abilityScores, setAbilityScores] =
		useState<AbilityScores>(_abilityScores);
	const [isHovered, setIsHovered] = useState(false);
	const [modifyCharacterAbilityScoresMutation] =
		useModifyCharacterAbilityScoresMutation();

	useEffect(() => {
		const img = new Image();
		img.src = AbilityScoreInfo;
	}, []);

	const debounceModifyAbilityScores = useCallback(
		debounce(async (abilityScores: AbilityScores) => {
			try {
				modifyCharacterAbilityScoresMutation({
					abilityScores,
					characterID,
				}).unwrap();
			} catch (error) {
				toast("Error updating ability scores", { type: "error" });
				console.error("Error updating ability scores", error);
			}
		}, 300),
		[],
	);

	return (
		<div
			className="w-full h-full
				grid grid-cols-subgrid place-items-center
				md:grid-cols-6 md:grid-rows-1 gap-1 gap-y-5 md:gap-5
				relative"
		>
			<div
				className="absolute right-[-1.5rem] top-0 z-10"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<InfoIcon  />
			</div>
			{isHovered && (
				<img
					src={AbilityScoreInfo}
					alt="Ability Score Info"
					className="absolute right-0 mt-32 border-4 border-black rounded-lg z-50"
				/>
			)}
			<AbilityScore
				abilityScore={abilityScores.strength}
				updateAttribute={(attr) => {
					setAbilityScores((prev) => {
						const newValue: AbilityScores = { ...prev, strength: attr };
						debounceModifyAbilityScores(newValue);
						return newValue;
					});
				}}
				name={"Strength"}
			/>
			<AbilityScore
				abilityScore={abilityScores.dexterity}
				updateAttribute={(attr) => {
					setAbilityScores((prev) => {
						const newValue: AbilityScores = { ...prev, dexterity: attr };
						debounceModifyAbilityScores(newValue);
						return newValue;
					});
				}}
				name={"Dexterity"}
			/>
			<AbilityScore
				abilityScore={abilityScores.constitution}
				updateAttribute={(attr) => {
					setAbilityScores((prev) => {
						const newValue: AbilityScores = { ...prev, constitution: attr };
						debounceModifyAbilityScores(newValue);
						return newValue;
					});
				}}
				name={"Constitution"}
			/>
			<AbilityScore
				abilityScore={abilityScores.intelligence}
				updateAttribute={(attr) => {
					setAbilityScores((prev) => {
						const newValue: AbilityScores = { ...prev, intelligence: attr };
						debounceModifyAbilityScores(newValue);
						return newValue;
					});
				}}
				name={"Intelligence"}
			/>
			<AbilityScore
				abilityScore={abilityScores.wisdom}
				updateAttribute={(attr) => {
					setAbilityScores((prev) => {
						const newValue: AbilityScores = { ...prev, wisdom: attr };
						debounceModifyAbilityScores(newValue);
						return newValue;
					});
				}}
				name={"Wisdom"}
			/>
			<AbilityScore
				abilityScore={abilityScores.charisma}
				updateAttribute={(attr) => {
					setAbilityScores((prev) => {
						const newValue: AbilityScores = { ...prev, charisma: attr };
						debounceModifyAbilityScores(newValue);
						return newValue;
					});
				}}
				name={"Charisma"}
			/>
		</div>
	);
};

export default AbilitScoresComp;