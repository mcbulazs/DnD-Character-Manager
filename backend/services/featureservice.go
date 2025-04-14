package services

import (
	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
)

type FeatureRepositoryInterface interface {
	CreateFeature(feature *models.CharacterFeatureModel) error
	UpdateFeature(feature *models.CharacterFeatureModel) error
	DeleteFeature(featureID int, characterID int) error
}

type FeatureService struct {
	Repo FeatureRepositoryInterface
}

func NewFeatureService(repo FeatureRepositoryInterface) *FeatureService {
	return &FeatureService{
		Repo: repo,
	}
}

func (s *FeatureService) CreateFeature(characterFeatureDTO *dto.CharacterCreateFeatureDTO, characterID int) (*dto.CharacterFeatureDTO, error) {
	featureModel := models.CharacterFeatureModel{
		Name:        characterFeatureDTO.Name,
		Description: characterFeatureDTO.Description,
		Source:      characterFeatureDTO.Source,
		CharacterID: uint(characterID),
	}
	err := s.Repo.CreateFeature(&featureModel)
	if err != nil {
		return nil, err
	}
	featureDTO := convertToCharacterFeatureDTO(&featureModel)

	return featureDTO, nil
}

func (s *FeatureService) UpdateFeature(characterFeatureDTO *dto.CharacterFeatureDTO, characterID int) error {
	featureModel := convertToCharacterFeatureModel(characterFeatureDTO)
	featureModel.CharacterID = uint(characterID)
	err := s.Repo.UpdateFeature(featureModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *FeatureService) DeleteFeature(featureID int, characterID int) error {
	err := s.Repo.DeleteFeature(featureID, characterID)
	if err != nil {
		return err
	}
	return nil
}

func convertToCharacterFeatureDTO(characterFeature *models.CharacterFeatureModel) *dto.CharacterFeatureDTO {
	return &dto.CharacterFeatureDTO{
		ID:          characterFeature.ID,
		Name:        characterFeature.Name,
		Description: characterFeature.Description,
		Source:      characterFeature.Source,
	}
}

func convertToCharacterFeatureDTOs(characterFeatures []models.CharacterFeatureModel) []dto.CharacterFeatureDTO {
	dtos := make([]dto.CharacterFeatureDTO, len(characterFeatures))
	for i, feature := range characterFeatures {
		dtos[i] = *convertToCharacterFeatureDTO(&feature)
	}
	return dtos
}

func convertToCharacterFeatureModel(characterFeatureDTO *dto.CharacterFeatureDTO) *models.CharacterFeatureModel {
	featureModel := models.CharacterFeatureModel{
		Name:        characterFeatureDTO.Name,
		Description: characterFeatureDTO.Description,
		Source:      characterFeatureDTO.Source,
	}
	featureModel.ID = characterFeatureDTO.ID
	return &featureModel
}
