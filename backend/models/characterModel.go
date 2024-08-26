package models

import (
	"gorm.io/gorm"
)



type Character struct {
	gorm.Model
	UserID        uint                  `json:"userId"`
	Name          string                `json:"name" gorm:"default:''"`
	Class         string                `json:"class" gorm:"default:''"`
	IsFavorite    bool                  `json:"is_favorite" gorm:"default:false"`
	Image         CharacterImage        `json:"image" gorm:"foreignKey:CharacterID"`
	AbilityScores CharacterAbilityScore `json:"ability_scores" gorm:"foreignKey:CharacterID"`
}

type CharacterImage struct {
	gorm.Model
	CharacterID        uint   `json:"characterId"`
	BackgroundImage    string `json:"background_image" gorm:"default:'url(https://www.dndbeyond.com/avatars/thumbnails/6/258/420/618/636271801914013762.png)'"`
	BackgroundSize     string `json:"background_size" gorm:"default:'cover'"`
	BackgroundPosition string `json:"background_position" gorm:"default:'top'"`
}

type CharacterAbilityScore struct {
	gorm.Model
	CharacterID  uint `json:"characterId"`
	Strength     int  `json:"strength" gorm:"default:10"`
	Dexterity    int  `json:"dexterity" gorm:"default:10"`
	Constitution int  `json:"constitution" gorm:"default:10"`
	Intelligence int  `json:"intelligence" gorm:"default:10"`
	Wisdom       int  `json:"wisdom" gorm:"default:10"`
	Charisma     int  `json:"charisma" gorm:"default:10"`
}
