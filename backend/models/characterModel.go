package models

import (
	"gorm.io/gorm"
)

type Character struct {
	gorm.Model
	UserID     uint            `json:"userId"`
	Name       string          `gorm:"default:''" json:"name"`
	Class      string          `gorm:"default:''" json:"class"`
	IsFavorite bool            `gorm:"default:false" json:"isFavorite"`
	Image      BackgroundImage `json:"image" gorm:"foreignKey:CharacterID"`
}
type BackgroundImage struct {
	gorm.Model
	CharacterID        uint   `json:"characterId"`
	BackgroundImage    string `json:"background_image" gorm:"default:'url(https://www.dndbeyond.com/avatars/thumbnails/6/258/420/618/636271801914013762.png)'"`
	BackgroundSize     string `json:"background_size" gorm:"default:'cover'"`
	BackgroundPosition string `json:"background_position" gorm:"default:'top'"`
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
