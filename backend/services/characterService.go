package services

import (
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
)

type CharacterService struct {
	DB *gorm.DB
}

func NewCharacterService(db *gorm.DB) *CharacterService {
	return &CharacterService{DB: db}
}

func (s *CharacterService) CreateCharacter(character *models.Character) error {
	err := character.Create(s.DB)
	if err != nil {
		return err
	}
	return nil
}

func (s *CharacterService) FindCharacterByID(id int) (*models.Character, error) {
	character, err := models.FindCharacterByID(s.DB, id)
	if err != nil {
		return nil, err
	}
	return character, nil
}

func (s *CharacterService) FindCharactersByUserID(userID uint) ([]models.Character, error) {
	characters, err := models.FindCharactersByUserID(s.DB, userID)
	if err != nil {
		return nil, err
	}
	return characters, nil
}

func (s *CharacterService) SetFavorite(character *models.Character) error {
	err := character.SetFavorite(s.DB)
	if err != nil {
		return err
	}
	return nil
}
