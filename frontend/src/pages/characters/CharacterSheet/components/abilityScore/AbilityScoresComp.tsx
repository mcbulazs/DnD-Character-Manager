import InfoIcon from "@mui/icons-material/Info";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AbilityScoreInfo from "/publicfile_AbilityScoreInfo.png";
import { useModifyCharacterAbilityScoresMutation } from "../../../../store/api/characterApiSlice";
import type { AbilityScores } from "../../../../types/characterData";
import debounce from "../../../../utility/debounce";
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
		debounce(async (as: AbilityScores) => {
			try {
				modifyCharacterAbilityScoresMutation({
					abilityScores: as,
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
			className="
				w-full
				flex flex-row flex-wrap justify-center gap-4 relative"
		>
			<AbilityScore
				attribute={abilityScores.strength}
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
				attribute={abilityScores.dexterity}
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
				attribute={abilityScores.constitution}
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
				attribute={abilityScores.intelligence}
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
				attribute={abilityScores.wisdom}
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
				attribute={abilityScores.charisma}
				updateAttribute={(attr) => {
					setAbilityScores((prev) => {
						const newValue: AbilityScores = { ...prev, charisma: attr };
						debounceModifyAbilityScores(newValue);
						return newValue;
					});
				}}
				name={"Charisma"}
			/>
			<div
				className="absolute lg:right-[-1.5rem] right-0 xl:right-0\"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<InfoIcon fontSize="large" />
			</div>
			{isHovered && (
				<img
					src={AbilityScoreInfo}
					alt="Ability Score Info"
					className="absolute right-0 mt-10 border-4 border-black rounded-lg"
				/>
			)}
		</div>
	);
};

export default AbilitScoresComp;
