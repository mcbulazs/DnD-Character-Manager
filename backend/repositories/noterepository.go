package repositories

import (
	"strings"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"DnDCharacterSheet/models"
)

type NoteRepository struct {
	DB *gorm.DB
}

func NewNoteRepository(DB *gorm.DB) *NoteRepository {
	return &NoteRepository{DB: DB}
}

func (r *NoteRepository) IsCategoryBelongToCharacter(categoryID int, characterID int) bool {
	var category models.CharacterNoteCategoryModel
	tx := r.DB.First(&category, categoryID)
	if tx.Error != nil {
		return false
	}
	return category.CharacterID == uint(characterID)
}

func (r *NoteRepository) CreateNoteCategory(categoryModel *models.CharacterNoteCategoryModel) error {
	tx := r.DB.Begin()
	err := tx.Create(categoryModel).Error
	if err != nil {
		tx.Rollback()
		if strings.Contains(err.Error(), "FOREIGN KEY constraint") {
			return gorm.ErrForeignKeyViolated
		}
		return err
	}
	note := models.CharacterNoteModel{
		Note:       "",
		CategoryID: categoryModel.ID,
	}
	err = tx.Create(&note).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return nil
}

func (r *NoteRepository) UpdateNoteCategory(categoryModel *models.CharacterNoteCategoryModel) error {
	tx := r.DB.Model(&categoryModel).
		Clauses(clause.Returning{}).
		Select("name", "description").
		Where("id = ? AND character_id = ?", categoryModel.ID, categoryModel.CharacterID).
		Updates(&categoryModel)
	if tx.Error != nil {
		return tx.Error
	}
	if tx.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *NoteRepository) DeleteNoteCategory(categoryID int, characterID int) error {
	tx := r.DB.Begin()
	rx := tx.Where("id = ? AND character_id = ?", categoryID, characterID).Delete(&models.CharacterNoteCategoryModel{})
	if rx.Error != nil {
		tx.Rollback()
		return rx.Error
	}
	if rx.RowsAffected == 0 {
		tx.Rollback()
		return gorm.ErrRecordNotFound
	}
	err := tx.Where("category_id = ?", categoryID).Delete(&models.CharacterNoteModel{}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return nil
}

func (r *NoteRepository) CreateNote(noteModel *models.CharacterNoteModel) error {
	tx := r.DB.Create(noteModel)
	if tx.Error != nil {
		if strings.Contains(tx.Error.Error(), "FOREIGN KEY constraint") {
			return gorm.ErrForeignKeyViolated
		}
		return tx.Error
	}
	return nil
}

func (r *NoteRepository) UpdateNote(noteModel *models.CharacterNoteModel, categoryID int) error {
	tx := r.DB.Model(&models.CharacterNoteModel{}).
		Clauses(clause.Returning{}).
		Select("note").
		Where("id = ? AND category_id = ?", noteModel.ID, categoryID).
		Updates(&noteModel)
	if tx.Error != nil {
		return tx.Error
	}
	if tx.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *NoteRepository) DeleteNote(noteID int, categoryID int) error {
	tx := r.DB.
		Where("id = ? AND category_id = ?", noteID, categoryID).
		Delete(&models.CharacterNoteModel{})
	if tx.Error != nil {
		return tx.Error
	}
	if tx.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
