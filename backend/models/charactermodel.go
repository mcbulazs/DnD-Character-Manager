package models

import (
	"gorm.io/gorm"
)

type CharacterModel struct {
	gorm.Model
	UserID            uint
	Name              string                     `gorm:"default:''"`
	Class             string                     `gorm:"default:''"`
	IsFavorite        bool                       `gorm:"default:false"`
	ArmorClass        int                        `gorm:"default:null"`
	Initiative        int                        `gorm:"default:null"`
	Speed             int                        `gorm:"default:null"`
	PassivePerception int                        `gorm:"default:null"`
	ProficiencyBonus  int                        `gorm:"default:null"`
	Background        string                     `gorm:"default:''"`
	Alignment         string                     `gorm:"default:''"`
	Image             CharacterImageModel        `gorm:"foreignKey:CharacterID"`
	AbilityScores     CharacterAbilityScoreModel `gorm:"foreignKey:CharacterID"`
	SavingThrows      CharacterSavingThrowModel  `gorm:"foreignKey:CharacterID"`
	Skills            CharacterSkillModel        `gorm:"foreignKey:CharacterID"`
}

func (c *CharacterModel) TableName() string {
	return "characters"
}

type CharacterImageModel struct {
	gorm.Model
	CharacterID        uint
	BackgroundImage    string `gorm:"default:''"`
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
