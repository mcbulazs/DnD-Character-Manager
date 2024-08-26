package repositories

import (
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
)

type CharacterRepository struct {
	DB *gorm.DB
}

func NewCharacterRepository(db *gorm.DB) *CharacterRepository {
	return &CharacterRepository{DB: db}
}

func (r *CharacterRepository) Create(character *models.Character) error {
	return r.DB.Create(character).Error
}

func (r *CharacterRepository) FindByID(id int) (*models.Character, error) {
	var character models.Character
	err := r.DB.Preload("Image").First(&character, id).Error
	if err != nil {
		return nil, err
	}
	return &character, nil
}

func (r *CharacterRepository) FindByUserID(userID uint) ([]models.Character, error) {
	var characters []models.Character
	err := r.DB.Where("user_id = ?", userID).Order("is_favorite DESC").Preload("Image").Find(&characters).Error
	if err != nil {
		return nil, err
	}
	return characters, nil
}

func (r *CharacterRepository) SetFavorite(character *models.Character) error {
	return r.DB.Model(character).Update("is_favorite", !character.IsFavorite).Error
}
