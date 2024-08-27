export interface Attribute {
    value: number;
    modifier: number;
}

export interface AbilityScores {
    strength: Attribute;
    dexterity: Attribute;
    constitution: Attribute;
    intelligence: Attribute;
    wisdom: Attribute;
    charisma: Attribute;
}

export interface ProficientAttribute  {
    modifier: number;
    proficient: boolean;
}

export interface SavingThrows {
    strength: ProficientAttribute;
    dexterity: ProficientAttribute;
    constitution: ProficientAttribute;
    intelligence: ProficientAttribute;
    wisdom: ProficientAttribute;
    charisma: ProficientAttribute;
}

export interface Skill extends ProficientAttribute {
    expertise: boolean;
}

export interface Skills {
    acrobatics: Skill;
    animalHandling: Skill;
    arcana: Skill;
    athletics: Skill;
    deception: Skill;
    history: Skill;
    insight: Skill;
    intimidation: Skill;
    investigation: Skill;
    medicine: Skill;
    nature: Skill;
    perception: Skill;
    performance: Skill;
    persuasion: Skill;
    religion: Skill;
    sleightOfHand: Skill;
    stealth: Skill;
    survival: Skill;
}

export interface CharacterData {
    id: number;
    name: string;
    class: string;
    armorClass: number;
    initiative: number;
    speed: number;
    passivePerception: number;
    abilityScores: AbilityScores;
    savingThrows: SavingThrows;
    skills: Skills;
}
