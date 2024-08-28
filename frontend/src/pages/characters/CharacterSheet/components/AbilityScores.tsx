import { useCallback } from "react";
import type { AbilityScores } from "../../../../types/characterData";
import type { Attribute } from "../../../../types/characterData";
import AbilityScore from "./AbilityScore";

const AbilitScoresComp: React.FC<{
	scores: AbilityScores;
	updateAbilityScores: (as: AbilityScores) => void;
}> = ({ scores, updateAbilityScores }) => {
	return (
		<>
			<AbilityScore
				attribute={scores?.strength ?? { value: 0, modifier: 0 }}
				updateAttribute={(attr) => {
					updateAbilityScores({ ...scores, strength: attr });
				}}
				name={"Strength"}
			/>
			<AbilityScore
				attribute={scores?.dexterity ?? { value: 0, modifier: 0 }}
				updateAttribute={(attr) => {
					updateAbilityScores({ ...scores, dexterity: attr });
				}}
				name={"Dexterity"}
			/>
			<AbilityScore
				attribute={scores?.constitution ?? { value: 0, modifier: 0 }}
				updateAttribute={(attr) => {
					updateAbilityScores({ ...scores, constitution: attr });
				}}
				name={"Constitution"}
			/>
			<AbilityScore
				attribute={scores?.intelligence ?? { value: 0, modifier: 0 }}
				updateAttribute={(attr) => {
					updateAbilityScores({ ...scores, intelligence: attr });
				}}
				name={"Intelligence"}
			/>
			<AbilityScore
				attribute={scores?.wisdom ?? { value: 0, modifier: 0 }}
				updateAttribute={(attr) => {
					updateAbilityScores({ ...scores, wisdom: attr });
				}}
				name={"Wisdom"}
			/>
			<AbilityScore
				attribute={scores?.charisma ?? { value: 0, modifier: 0 }}
				updateAttribute={(attr) => {
					updateAbilityScores({ ...scores, charisma: attr });
				}}
				name={"Charisma"}
			/>
		</>
	);
};

export default AbilitScoresComp;
