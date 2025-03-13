package services

import (
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
)

type NoteService struct {
	Repo *repositories.NoteRepository
}

func NewNoteService(DB *gorm.DB) NoteService {
	return NoteService{
		Repo: repositories.NewNoteRepository(DB),
	}
}

func (s NoteService) IsNoteCategoryCharacters(characterID int, noteCategoryID int) bool {
	return s.Repo.IsCategoryBelongToCharacter(noteCategoryID, characterID)
}

func (s *NoteService) CreateNoteCategory(characterID int, noteCategoryDTO *dto.CharacterCreateNoteCategoryDTO) (*dto.CharacterNoteCategoryDTO, error) {
	noteCategoryModel := models.CharacterNoteCategoryModel{
		Name:        noteCategoryDTO.Name,
		Description: noteCategoryDTO.Description,
		CharacterID: uint(characterID),
	}
	noteCategoryModel.CharacterID = uint(characterID)
	err := s.Repo.CreateNoteCategory(&noteCategoryModel)
	if err != nil {
		return nil, err
	}
	newNoteCategoryDTO := convertToCharacterNoteCategoryDTO(&noteCategoryModel)
	return newNoteCategoryDTO, nil
}

func (s *NoteService) UpdateNoteCategory(characterID int, noteCategoryDTO *dto.CharacterNoteCategoryDTO) error {
	noteCategoryModel := convertToCharacterNoteCategoryModel(noteCategoryDTO)
	noteCategoryModel.CharacterID = uint(characterID)
	err := s.Repo.UpdateNoteCategory(noteCategoryModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *NoteService) DeleteNoteCategory(noteCategoryID int, characterID int) error {
	err := s.Repo.DeleteNoteCategory(noteCategoryID, characterID)
	if err != nil {
		return err
	}
	return nil
}

func (s *NoteService) CreateNote(categoryId int, noteDTO *dto.CharacterCreateNoteDTO) (*dto.CharacterNoteDTO, error) {
	noteModel := models.CharacterNoteModel{
		Note: noteDTO.Note,
	}
	noteModel.CategoryID = uint(categoryId)
	err := s.Repo.CreateNote(&noteModel)
	if err != nil {
		return nil, err
	}
	newNoteDTO := *convertToCharacterNoteDTO(&noteModel)
	return &newNoteDTO, nil
}

func (s *NoteService) UpdateNote(categoryID int, noteDTO *dto.CharacterNoteDTO) error {
	noteModel := convertToCharacterNoteModel(noteDTO)
	noteModel.CategoryID = uint(categoryID)
	err := s.Repo.UpdateNote(noteModel, categoryID)
	if err != nil {
		return err
	}
	return nil
}

func (s *NoteService) DeleteNote(categoryID int, noteID int) error {
	err := s.Repo.DeleteNote(noteID, categoryID)
	if err != nil {
		return err
	}
	return nil
}

func convertToCharacterNoteDTO(noteModel *models.CharacterNoteModel) *dto.CharacterNoteDTO {
	return &dto.CharacterNoteDTO{
		ID:   noteModel.ID,
		Note: noteModel.Note,
	}
}

func convertToCharacterNoteDTOs(noteModels []models.CharacterNoteModel) []dto.CharacterNoteDTO {
	noteDTOs := make([]dto.CharacterNoteDTO, len(noteModels))
	for i, noteModel := range noteModels {
		noteDTOs[i] = *convertToCharacterNoteDTO(&noteModel)
	}
	return noteDTOs
}

func convertToCharacterNoteCategoryDTO(noteCategoryModel *models.CharacterNoteCategoryModel) *dto.CharacterNoteCategoryDTO {
	return &dto.CharacterNoteCategoryDTO{
		ID:          noteCategoryModel.ID,
		Name:        noteCategoryModel.Name,
		Description: noteCategoryModel.Description,
		Notes:       convertToCharacterNoteDTOs(noteCategoryModel.Notes),
	}
}

func convertToCharacterNoteCategoryDTOs(noteCategoryModels []models.CharacterNoteCategoryModel) []dto.CharacterNoteCategoryDTO {
	noteCategoryDTOs := make([]dto.CharacterNoteCategoryDTO, len(noteCategoryModels))
	for i, noteCategoryModel := range noteCategoryModels {
		noteCategoryDTOs[i] = *convertToCharacterNoteCategoryDTO(&noteCategoryModel)
	}
	return noteCategoryDTOs
}

func convertToCharacterNoteModel(noteDTO *dto.CharacterNoteDTO) *models.CharacterNoteModel {
	model := models.CharacterNoteModel{
		Note: noteDTO.Note,
	}
	model.ID = noteDTO.ID
	return &model
}

func convertToCharacterNoteCategoryModel(noteCategoryDTO *dto.CharacterNoteCategoryDTO) *models.CharacterNoteCategoryModel {
	model := models.CharacterNoteCategoryModel{
		Name:        noteCategoryDTO.Name,
		Description: noteCategoryDTO.Description,
	}
	model.ID = noteCategoryDTO.ID
	return &model
}
