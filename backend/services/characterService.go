package services

import (
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"

	"gorm.io/gorm"
)

type CharacterService struct {
	Repo *repositories.CharacterRepository
}

func NewCharacterService(DB *gorm.DB) *CharacterService {
	return &CharacterService{
		Repo: repositories.NewCharacterRepository(DB),
	}
}

func (s *CharacterService) CreateCharacter(character *models.Character) error {
	return s.Repo.Create(character)
}

func (s *CharacterService) FindCharacterByID(id int) (*models.Character, error) {
	return s.Repo.FindByID(id)
}

func (s *CharacterService) FindCharactersByUserID(userID uint) ([]models.Character, error) {
	return s.Repo.FindByUserID(userID)
}

func (s *CharacterService) SetFavorite(character *models.Character) error {
	return s.Repo.SetFavorite(character)
}
