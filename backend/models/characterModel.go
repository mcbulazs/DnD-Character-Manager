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

func (character *Character) Create(db *gorm.DB) error {
	tx := db.Create(character)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func FindCharacterByID(db *gorm.DB, id int) (*Character, error) {
	var character Character
	tx := db.Preload("Image").First(&character, id)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &character, nil
}

func FindCharactersByUserID(db *gorm.DB, userID uint) ([]Character, error) {
	var characters []Character
	tx := db.Where("user_id = ?", userID).Order("is_favorite DESC").Preload("Image").Find(&characters)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return characters, nil
}

func (character *Character) SetFavorite(db *gorm.DB) error {
	tx := db.Model(character).Update("is_favorite", !character.IsFavorite)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}
