import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useState } from "react";
import AbilityScoreInfo from "/publicfile_AbilityScoreInfo.png";
import type { AbilityScores } from "../../../../types/characterData";
import AbilityScore from "./AbilityScore";

const AbilitScoresComp: React.FC<{
	scores: AbilityScores;
	updateAbilityScores: (as: AbilityScores) => void;
}> = ({ scores, updateAbilityScores }) => {
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
        // Preload the image
        const img = new Image();
        img.src = AbilityScoreInfo;
    }, []);

	return (
		<div
			className="
				w-full 
				flex flex-row flex-wrap justify-center gap-4 relative"
		>
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
			<div
				className="absolute lg:right-[-1.5rem] right-0 xl:right-0\"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<InfoIcon fontSize="large"/>
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
