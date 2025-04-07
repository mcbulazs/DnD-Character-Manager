import type { BackgroundImageProps } from "./backgroundImageProps";
import type { Feature } from "./feature";
import type { NoteCategory } from "./note";
import type { Spell } from "./spell";
import type { Tracker } from "./tracker";
import { Friends } from "./user";

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

export interface ProficientAttribute {
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

export type CharacterOptions = {
  isDead: boolean;
  isCaster: boolean;
  rollOption: boolean;
  isXP: boolean;
};

export type CharacterData = {
  ID: number;
  isOwner: boolean;
  name: string;
  class: string;
  race: string;
  level: number;
  isFavorite: boolean;
  armorClass: number;
  initiative: number;
  speed: number;
  passivePerception: number;
  proficiencyBonus: number;
  options: CharacterOptions;
  abilityScores: AbilityScores;
  savingThrows: SavingThrows;
  skills: Skills;
  image: BackgroundImageProps;
  features: Feature[];
  spells: Spell[];
  trackers: Tracker[];
  noteCategories: NoteCategory[];
  sharedWith: Friends[];
};
