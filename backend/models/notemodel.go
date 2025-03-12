package models

import "gorm.io/gorm"

type CharacterNoteCategoryModel struct {
	gorm.Model
	CharacterID uint
	Name        string
	Description string
	Notes       []CharacterNoteModel `gorm:"foreignKey:CategoryID"`
}

func (c *CharacterNoteCategoryModel) TableName() string {
	return "character_note_categories"
}

type CharacterNoteModel struct {
	gorm.Model
	CategoryID uint
	Note       string
}

func (c *CharacterNoteModel) TableName() string {
	return "character_notes"
}
