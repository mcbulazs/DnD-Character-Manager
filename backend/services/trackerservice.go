package services

import (
	"fmt"

	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
)

type TrackerService struct {
	Repo repositories.TrackerRepository
}

func NewTrackerService(DB *gorm.DB) TrackerService {
	return TrackerService{Repo: *repositories.NewTrackerRepository(DB)}
}

func (s *TrackerService) CreateTracker(characterID int, trackerDTO *dto.CreateCharacterTrackerDTO) (*dto.CharacterTrackerDTO, error) {
	trackerModel := &models.CharacterTrackerModel{
		Name:         trackerDTO.Name,
		Type:         models.TrackerEnum.Custom,
		MaxValue:     trackerDTO.MaxValue,
		CurrentValue: trackerDTO.MaxValue,
		CharacterID:  uint(characterID),
	}
	err := s.Repo.CreateTracker(trackerModel)
	if err != nil {
		return nil, err
	}
	return convertToCharacterTrackerDTO(trackerModel), nil
}

func (s *TrackerService) UpdateTracker(characterID int, trackerDTO *dto.CharacterTrackerDTO) error {
	trackerModel := convertToCharacterTrackerModel(*trackerDTO)
	trackerModel.CharacterID = uint(characterID)
	err := s.Repo.UpdateTracker(&trackerModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *TrackerService) DeleteTracker(characterID int, trackerID int) error {
	err := s.Repo.DeleteTracker(characterID, trackerID)
	if err != nil {
		return err
	}
	return nil
}

func convertToCharacterTrackerDTO(trackerModel *models.CharacterTrackerModel) *dto.CharacterTrackerDTO {
	return &dto.CharacterTrackerDTO{
		ID:           trackerModel.ID,
		Type:         trackerModel.Type,
		Name:         trackerModel.Name,
		MaxValue:     trackerModel.MaxValue,
		CurrentValue: trackerModel.CurrentValue,
	}
}

func convertToCharacterTrackerDTOs(trackerModels []models.CharacterTrackerModel) []dto.CharacterTrackerDTO {
	trackerDTOs := make([]dto.CharacterTrackerDTO, len(trackerModels))
	for i, trackerModel := range trackerModels {
		trackerDTOs[i] = *convertToCharacterTrackerDTO(&trackerModel)
	}
	return trackerDTOs
}

func convertToCharacterTrackerModel(trackerDTO dto.CharacterTrackerDTO) models.CharacterTrackerModel {
	trackerModel := models.CharacterTrackerModel{
		Type:         trackerDTO.Type,
		Name:         trackerDTO.Name,
		MaxValue:     trackerDTO.MaxValue,
		CurrentValue: trackerDTO.CurrentValue,
	}
	trackerModel.ID = trackerDTO.ID
	return trackerModel
}
