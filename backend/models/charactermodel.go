package models

import (
	"gorm.io/gorm"
)

type CharacterModel struct {
	gorm.Model
	UserID            uint
	Name              string
	Class             string
	Race              string
	Level             int `gorm:"default:1"`
	IsFavorite        bool
	ArmorClass        int
	Initiative        int
	Speed             int
	PassivePerception int
	ProficiencyBonus  int
	Image             CharacterImageModel          `gorm:"foreignKey:CharacterID"`
	AbilityScores     CharacterAbilityScoreModel   `gorm:"foreignKey:CharacterID"`
	SavingThrows      CharacterSavingThrowModel    `gorm:"foreignKey:CharacterID"`
	Skills            CharacterSkillModel          `gorm:"foreignKey:CharacterID"`
	Features          []CharacterFeatureModel      `gorm:"foreignKey:CharacterID"`
	Spells            []CharacterSpellModel        `gorm:"foreignKey:CharacterID"`
	Trackers          []CharacterTrackerModel      `gorm:"foreignKey:CharacterID"`
	NoteCategories    []CharacterNoteCategoryModel `gorm:"foreignKey:CharacterID"`
	SharedWith        []FriendShareModel           `gorm:"foreignKey:CharacterID"`
}

func (c *CharacterModel) TableName() string {
	return "characters"
}

type CharacterImageModel struct {
	gorm.Model
	CharacterID        uint
	BackgroundImage    string
	BackgroundSize     string `gorm:"default:'cover'"`
	BackgroundPosition string `gorm:"default:'top'"`
}

func (c *CharacterImageModel) TableName() string {
	return "character_images"
}

// Attribute represents an attribute with value and modifier.
type Attribute struct {
	Value    int `gorm:"default:null"`
	Modifier int `gorm:"default:null"`
}

// ProficientAttribute represents attributes with proficiency.
type ProficientAttribute struct {
	Modifier   int  `gorm:"default:null"`
	Proficient bool `gorm:"default:false"`
}

// Skill extends ProficientAttribute with expertise.
type Skill struct {
	ProficientAttribute
	Expertise bool `gorm:"default:false"`
}

// AbilityScores holds attributes for core ability scores.
type CharacterAbilityScoreModel struct {
	gorm.Model
	CharacterID  uint
	Strength     Attribute `gorm:"embedded; embeddedPrefix:strength_"`
	Dexterity    Attribute `gorm:"embedded; embeddedPrefix:dexterity_"`
	Constitution Attribute `gorm:"embedded; embeddedPrefix:constitution_"`
	Intelligence Attribute `gorm:"embedded; embeddedPrefix:intelligence_"`
	Wisdom       Attribute `gorm:"embedded; embeddedPrefix:wisdom_"`
	Charisma     Attribute `gorm:"embedded; embeddedPrefix:charisma_"`
}

func (c *CharacterAbilityScoreModel) TableName() string {
	return "character_ability_scores"
}

type CharacterSavingThrowModel struct {
	gorm.Model
	CharacterID  uint
	Strength     ProficientAttribute `gorm:"embedded; embeddedPrefix:strength_"`
	Dexterity    ProficientAttribute `gorm:"embedded; embeddedPrefix:dexterity_"`
	Constitution ProficientAttribute `gorm:"embedded; embeddedPrefix:constitution_"`
	Intelligence ProficientAttribute `gorm:"embedded; embeddedPrefix:intelligence_"`
	Wisdom       ProficientAttribute `gorm:"embedded; embeddedPrefix:wisdom_"`
	Charisma     ProficientAttribute `gorm:"embedded; embeddedPrefix:charisma_"`
}

func (c *CharacterSavingThrowModel) TableName() string {
	return "character_saving_throws"
}

type CharacterSkillModel struct {
	gorm.Model
	CharacterID    uint
	Acrobatics     Skill `gorm:"embedded; embeddedPrefix:acrobatics_"`
	AnimalHandling Skill `gorm:"embedded; embeddedPrefix:animal_handling_"`
	Arcana         Skill `gorm:"embedded; embeddedPrefix:arcana_"`
	Athletics      Skill `gorm:"embedded; embeddedPrefix:athletics_"`
	Deception      Skill `gorm:"embedded; embeddedPrefix:deception_"`
	History        Skill `gorm:"embedded; embeddedPrefix:history_"`
	Insight        Skill `gorm:"embedded; embeddedPrefix:insight_"`
	Intimidation   Skill `gorm:"embedded; embeddedPrefix:intimidation_"`
	Investigation  Skill `gorm:"embedded; embeddedPrefix:investigation_"`
	Medicine       Skill `gorm:"embedded; embeddedPrefix:medicine_"`
	Nature         Skill `gorm:"embedded; embeddedPrefix:nature_"`
	Perception     Skill `gorm:"embedded; embeddedPrefix:perception_"`
	Performance    Skill `gorm:"embedded; embeddedPrefix:performance_"`
	Persuasion     Skill `gorm:"embedded; embeddedPrefix:persuasion_"`
	Religion       Skill `gorm:"embedded; embeddedPrefix:religion_"`
	SleightOfHand  Skill `gorm:"embedded; embeddedPrefix:sleight_of_hand_"`
	Stealth        Skill `gorm:"embedded; embeddedPrefix:stealth_"`
	Survival       Skill `gorm:"embedded; embeddedPrefix:survival_"`
}

func (c *CharacterSkillModel) TableName() string {
	return "character_skills"
}

type CharacterFeatureModel struct {
	gorm.Model
	CharacterID uint
	Name        string
	Description string
	Source      string
}

func (c *CharacterFeatureModel) TableName() string {
	return "character_features"
}
