import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useModifyCharacterSkillsMutation } from "../../../../store/api/characterApiSlice";
import type { AbilityScores, Skills } from "../../../../types/characterData";
import debounce from "../../../../utility/debounce";
import Skill from "./Skill";

const SkillsComp: React.FC<{
	skills: Skills;
	abilityScores: AbilityScores;
	proficiencyBonus: number;
	characterID: number;
}> = ({ skills: _skills, abilityScores, proficiencyBonus, characterID }) => {
	const [skills, setSkills] = useState<Skills>(_skills);
	const [modifyCharacterSkillsMutation] = useModifyCharacterSkillsMutation();

	const debounceModifySkills = useCallback(
		debounce(async (skills: Skills) => {
			try {
				modifyCharacterSkillsMutation({
					skills: skills,
					characterID,
				}).unwrap();
			} catch (error) {
				toast("Error updating skills", { type: "error" });
				console.error("Error updating skills", error);
			}
		}, 300),
		[],
	);
	return (
		<table className="mt-10 w-full sm:w-1/2 md:w-auto">
			<tbody>
				<Skill
					skill={skills?.acrobatics ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, acrobatics: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Acrobatics"}
					type={"dex"}
					abilityScore={abilityScores.dexterity}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.animalHandling ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, animalHandling: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Animal Handling"}
					type={"wis"}
					abilityScore={abilityScores.wisdom}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.arcana ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, arcana: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Arcana"}
					type={"int"}
					abilityScore={abilityScores.intelligence}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.athletics ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, athletics: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Athletics"}
					type={"str"}
					abilityScore={abilityScores.strength}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.deception ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, deception: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Deception"}
					type={"cha"}
					abilityScore={abilityScores.charisma}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.history ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, history: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"History"}
					type={"int"}
					abilityScore={abilityScores.intelligence}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.insight ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, insight: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Insight"}
					type={"wis"}
					abilityScore={abilityScores.wisdom}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.intimidation ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, intimidation: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Intimidation"}
					type={"cha"}
					abilityScore={abilityScores.charisma}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.investigation ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, investigation: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Investigation"}
					type={"int"}
					abilityScore={abilityScores.intelligence}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.medicine ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, medicine: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Medicine"}
					type={"wis"}
					abilityScore={abilityScores.wisdom}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.nature ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, nature: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Nature"}
					type={"int"}
					abilityScore={abilityScores.intelligence}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.perception ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, perception: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Perception"}
					type={"wis"}
					abilityScore={abilityScores.wisdom}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.performance ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, performance: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Performance"}
					type={"cha"}
					abilityScore={abilityScores.charisma}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.persuasion ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, persuasion: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Persuasion"}
					type={"cha"}
					abilityScore={abilityScores.charisma}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.religion ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, religion: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Religion"}
					type={"int"}
					abilityScore={abilityScores.intelligence}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.sleightOfHand ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, sleightOfHand: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Sleight of Hand"}
					type={"dex"}
					abilityScore={abilityScores.dexterity}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.stealth ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, stealth: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Stealth"}
					type={"dex"}
					abilityScore={abilityScores.dexterity}
					proficiencyBonus={proficiencyBonus}
				/>
				<Skill
					skill={skills?.survival ?? { value: 0, modifier: 0 }}
					updateSkill={(skill) => {
						setSkills((prev) => {
							const newValue: Skills = { ...prev, survival: skill };
							debounceModifySkills(newValue);
							return newValue;
						});
					}}
					name={"Survival"}
					type={"wis"}
					abilityScore={abilityScores.wisdom}
					proficiencyBonus={proficiencyBonus}
				/>
			</tbody>
		</table>
	);
};

export default SkillsComp;
