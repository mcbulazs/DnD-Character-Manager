package models

import "gorm.io/gorm"

type CharacterSpellModel struct {
	gorm.Model
	CharacterID uint
	Name        string
	Level       int
	School      string
	CastingTime string
	Range       string
	Components  string
	Duration    string
	Description string
	Active      bool
}

func (s *CharacterSpellModel) TableName() string {
	return "character_spells"
}
