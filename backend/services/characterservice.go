package services

import (
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
)

type CharacterService struct {
	Repo *repositories.CharacterRepository
}

func NewCharacterService(DB *gorm.DB) *CharacterService {
	return &CharacterService{
		Repo: repositories.NewCharacterRepository(DB),
	}
}

func (s *CharacterService) CreateCharacter(character *dto.CreateCharacterDTO, userID int) error {
	characterModel := models.CharacterModel{
		Name:  character.Name,
		Class: character.Class,
		Image: convertToCharacterImage(&character.Image),
	}
	characterModel.UserID = uint(userID)
	return s.Repo.Create(&characterModel)
}

func (s *CharacterService) FindCharacterByID(id int, userID int) (*dto.CharacterDTO, error) {
	characterModel, err := s.Repo.FindByID(id)
	if characterModel == nil {
		return nil, err
	}
	if int(characterModel.UserID) != userID {
		return nil, gorm.ErrRecordNotFound
	}
	return convertToCharacterDTO(characterModel), nil
}

func (s *CharacterService) FindCharactersByUserID(userID uint) ([]dto.CharacterBaseDTO, error) {
	characters, err := s.Repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	return convertToCharacterBaseDTOs(characters), nil
}

func (s *CharacterService) SetFavorite(id int, userID int) (*dto.CharacterDTO, error) {
	character, err := s.FindCharacterByID(id, userID)
	if err != nil {
		return nil, err
	}
	err = s.Repo.SetFavorite(id, userID)
	if err != nil {
		return nil, err
	}
	character.IsFavorite = !character.IsFavorite
	return character, nil
}

func convertToCharacterImageDTO(image *models.CharacterImageModel) dto.CharacterImageDTO {
	return dto.CharacterImageDTO{
		BackgroundImage:    image.BackgroundImage,
		BackgroundSize:     image.BackgroundSize,
		BackgroundPosition: image.BackgroundPosition,
	}
}

func convertToCharacterImage(image *dto.CharacterImageDTO) models.CharacterImageModel {
	return models.CharacterImageModel{
		BackgroundImage:    image.BackgroundImage,
		BackgroundSize:     image.BackgroundSize,
		BackgroundPosition: image.BackgroundPosition,
	}
}

func convertToCharacterBaseDTO(character *models.CharacterModel) dto.CharacterBaseDTO {
	return dto.CharacterBaseDTO{
		ID:         character.ID,
		Name:       character.Name,
		Class:      character.Class,
		IsFavorite: character.IsFavorite,
		Image:      convertToCharacterImageDTO(&character.Image),
	}
}

func convertToCharacterDTO(character *models.CharacterModel) *dto.CharacterDTO {
	return &dto.CharacterDTO{
		ID:         character.ID,
		Name:       character.Name,
		Class:      character.Class,
		IsFavorite: character.IsFavorite,
		Image:      convertToCharacterImageDTO(&character.Image),
	}
}

func convertToCharacterBaseDTOs(characters []models.CharacterModel) []dto.CharacterBaseDTO {
	dtos := make([]dto.CharacterBaseDTO, len(characters))
	for i, character := range characters {
		dtos[i] = convertToCharacterBaseDTO(&character)
	}
	return dtos
}
