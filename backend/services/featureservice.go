package services

import (
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
)

type FeatureService struct {
	Repo *repositories.FeatureRepository
}

func NewFeatureService(DB *gorm.DB) *FeatureService {
	return &FeatureService{
		Repo: repositories.NewFeatureRepository(DB),
	}
}

func (s *FeatureService) GetFeatures(characterID int) ([]*dto.CharacterFeatureDTO, error) {
	featureModels, err := s.Repo.GetFeatures(characterID)
	if err != nil {
		return nil, err
	}
	return convertToCharacterFeatureDTOs(featureModels), nil
}

func (s *FeatureService) CreateFeature(characterFeatureDTO *dto.CharacterCreateFeatureDTO, characterID int) error {
	featureModel := models.CharacterFeatureModel{
		Name:        characterFeatureDTO.Name,
		Description: characterFeatureDTO.Description,
		Source:      characterFeatureDTO.Source,
	}
	featureModel.CharacterID = uint(characterID)
	err := s.Repo.CreateFeature(&featureModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *FeatureService) UpdateFeature(characterFeatureDTO *dto.CharacterFeatureDTO) error {
	featureModel := convertToCharacterFeatureModel(characterFeatureDTO)
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
		CharacterID: characterFeature.CharacterID,
		Name:        characterFeature.Name,
		Description: characterFeature.Description,
	}
}

func convertToCharacterFeatureDTOs(characterFeatures []*models.CharacterFeatureModel) []*dto.CharacterFeatureDTO {
	var characterFeaturesDTO []*dto.CharacterFeatureDTO
	for _, feature := range characterFeatures {
		characterFeaturesDTO = append(characterFeaturesDTO, convertToCharacterFeatureDTO(feature))
	}
	return characterFeaturesDTO
}

func convertToCharacterFeatureModel(characterFeatureDTO *dto.CharacterFeatureDTO) *models.CharacterFeatureModel {
	featureModel := models.CharacterFeatureModel{
		CharacterID: characterFeatureDTO.CharacterID,
		Name:        characterFeatureDTO.Name,
		Description: characterFeatureDTO.Description,
	}
	featureModel.ID = characterFeatureDTO.ID
	return &featureModel
}
