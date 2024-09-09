package services

import (
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
)

type SpellService struct {
	Repo repositories.SpellRepository
}

func NewSpellService(DB *gorm.DB) *SpellService {
	return &SpellService{
		Repo: *repositories.NewSpellRepository(DB),
	}
}

func (s *SpellService) CreateSpell(CharacterCreateSpellDTO *dto.CharacterCreateSpellDTO, characterID int) (*dto.CharacterSpellDTO, error) {
	spellModel := models.CharacterSpellModel{
		Name:        CharacterCreateSpellDTO.Name,
		Level:       CharacterCreateSpellDTO.Level,
		School:      CharacterCreateSpellDTO.School,
		CastingTime: CharacterCreateSpellDTO.CastingTime,
		Range:       CharacterCreateSpellDTO.Range,
		Components:  CharacterCreateSpellDTO.Components,
		Duration:    CharacterCreateSpellDTO.Duration,
		Description: CharacterCreateSpellDTO.Description,
	}
	spellModel.CharacterID = uint(characterID)
	err := s.Repo.CreateSpell(&spellModel)
	if err != nil {
		return nil, err
	}
	spellDTO := convertToCharacterSpellDTO(&spellModel)

	return spellDTO, nil
}

func (s *SpellService) UpdateSpell(spellDTO *dto.CharacterSpellDTO, characterID int) error {
	spellModel := convertToCharacterSpellModel(spellDTO)
	spellModel.CharacterID = uint(characterID)
	err := s.Repo.UpdateSpell(spellModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *SpellService) DeleteSpell(spellID int, characterID int) error {
	err := s.Repo.DeleteSpell(spellID, characterID)
	if err != nil {
		return err
	}
	return nil
}

func convertToCharacterSpellDTO(spellModel *models.CharacterSpellModel) *dto.CharacterSpellDTO {
	return &dto.CharacterSpellDTO{
		ID:          spellModel.ID,
		Name:        spellModel.Name,
		Level:       spellModel.Level,
		School:      spellModel.School,
		CastingTime: spellModel.CastingTime,
		Range:       spellModel.Range,
		Components:  spellModel.Components,
		Duration:    spellModel.Duration,
		Description: spellModel.Description,
		Active:      spellModel.Active,
	}
}

func convertToCharacterSpellDTOs(spellModels []models.CharacterSpellModel) []dto.CharacterSpellDTO {
	spellDTOs := make([]dto.CharacterSpellDTO, len(spellModels))
	for i, spellModel := range spellModels {
		spellDTOs[i] = *convertToCharacterSpellDTO(&spellModel)
	}
	return spellDTOs
}

func convertToCharacterSpellModel(spellDTO *dto.CharacterSpellDTO) *models.CharacterSpellModel {
	spellModel := models.CharacterSpellModel{
		Name:        spellDTO.Name,
		Level:       spellDTO.Level,
		School:      spellDTO.School,
		CastingTime: spellDTO.CastingTime,
		Range:       spellDTO.Range,
		Components:  spellDTO.Components,
		Duration:    spellDTO.Duration,
		Description: spellDTO.Description,
		Active:      spellDTO.Active,
	}
	spellModel.ID = spellDTO.ID
	return &spellModel
}
