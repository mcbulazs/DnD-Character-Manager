package models

import (
	"gorm.io/gorm"
)

type CharacterModel struct {
	gorm.Model
	UserID     uint
	Name       string              `gorm:"default:''"`
	Class      string              `gorm:"default:''"`
	IsFavorite bool                `gorm:"default:false"`
	Image      CharacterImageModel `gorm:"foreignKey:CharacterID"`
}

func (c *CharacterModel) TableName() string {
	return "characters"
}

type CharacterImageModel struct {
	gorm.Model
	CharacterID        uint
	BackgroundImage    string `gorm:"default:'url(https://www.dndbeyond.com/avatars/thumbnails/6/258/420/618/636271801914013762.png)'"`
	BackgroundSize     string `gorm:"default:'cover'"`
	BackgroundPosition string `gorm:"default:'top'"`
}

func (c *CharacterImageModel) TableName() string {
	return "character_images"
}

type CharacterAbilityScoreModel struct {
	gorm.Model
	CharacterID  uint
	Strength     int `gorm:"default:10"`
	Dexterity    int `gorm:"default:10"`
	Constitution int `gorm:"default:10"`
	Intelligence int `gorm:"default:10"`
	Wisdom       int `gorm:"default:10"`
	Charisma     int `gorm:"default:10"`
}

func (c *CharacterAbilityScoreModel) TableName() string {
	return "character_ability_scores"
}
