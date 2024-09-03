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

export interface ExpertiseAttribute extends ProficientAttribute {
    expertise: boolean;
}

export interface Skills {
    acrobatics: ExpertiseAttribute;
    animalHandling: ExpertiseAttribute;
    arcana: ExpertiseAttribute;
    athletics: ExpertiseAttribute;
    deception: ExpertiseAttribute;
    history: ExpertiseAttribute;
    insight: ExpertiseAttribute;
    intimidation: ExpertiseAttribute;
    investigation: ExpertiseAttribute;
    medicine: ExpertiseAttribute;
    nature: ExpertiseAttribute;
    perception: ExpertiseAttribute;
    performance: ExpertiseAttribute;
    persuasion: ExpertiseAttribute;
    religion: ExpertiseAttribute;
    sleightOfHand: ExpertiseAttribute;
    stealth: ExpertiseAttribute;
    survival: ExpertiseAttribute;
}

export type CharacterData = {
    ID: number;
    name: string;
    class: string;
    isFavorite: boolean;
    armorClass: number;
    initiative: number;
    speed: number;
    passivePerception: number;
    proficiencyBonus: number;
    abilityScores: AbilityScores;
    savingThrows: SavingThrows;
    skills: Skills;
}
