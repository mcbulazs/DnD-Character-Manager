package repositories

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"DnDCharacterSheet/models"
)

type CharacterRepository struct {
	DB *gorm.DB
}

func NewCharacterRepository(db *gorm.DB) *CharacterRepository {
	return &CharacterRepository{DB: db}
}

func (r *CharacterRepository) FindByID(characterID int) (*models.CharacterModel, error) {
	var character models.CharacterModel
	tx := r.DB.Preload("Image").
		Preload("SharedWith").
		Preload("AbilityScores").
		Preload("SavingThrows").
		Preload("Skills").
		Preload("Features").
		Preload("Spells").
		Preload("Trackers").
		Preload("NoteCategories").
		Preload("NoteCategories.Notes").
		First(&character, characterID)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &character, nil
}

func (r *CharacterRepository) IsUserCharacter(userID int, characterID int) bool {
	var character models.CharacterModel
	tx := r.DB.First(&character, characterID)
	if tx.Error != nil {
		return false
	}
	return character.UserID == uint(userID)
}

func (r *CharacterRepository) Create(character *models.CharacterModel) error {
	tx := r.DB.Begin()

	// Create the character
	if err := tx.Create(&character).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Create related models if needed
	character.AbilityScores.CharacterID = character.ID
	if err := tx.Create(&character.AbilityScores).Error; err != nil {
		tx.Rollback()
		return err
	}
	character.SavingThrows.CharacterID = character.ID
	if err := tx.Create(&character.SavingThrows).Error; err != nil {
		tx.Rollback()
		return err
	}
	character.Skills.CharacterID = character.ID
	if err := tx.Create(&character.Skills).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := CreateDefaultTrackers(tx, character.ID); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

func (r *CharacterRepository) Delete(characterID int, userID int) error {
	tx := r.DB.Where("id = ? AND user_id = ?", characterID, userID).Delete(&models.CharacterModel{})
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *CharacterRepository) UpdateAbilityScores(abilityScores *models.CharacterAbilityScoreModel) error {
	tx := r.DB.Model(&abilityScores).
		Clauses(clause.Returning{}).
		Select("*").
		Omit("id", "created_at", "updated_at", "delted_at", "character_id").
		Where("character_id = ?", abilityScores.CharacterID).
		Updates(&abilityScores)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *CharacterRepository) UpdateSkills(skills *models.CharacterSkillModel) error {
	tx := r.DB.Model(&skills).
		Clauses(clause.Returning{}).
		Select("*").
		Omit("id", "created_at", "updated_at", "delted_at", "character_id").
		Where("character_id = ?", skills.CharacterID).
		Updates(&skills)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *CharacterRepository) UpdateSavingThrows(savingThrows *models.CharacterSavingThrowModel) error {
	tx := r.DB.Model(&savingThrows).
		Clauses(clause.Returning{}).
		Select("*").
		Omit("id", "created_at", "updated_at", "delted_at", "character_id").
		Where("character_id = ?", savingThrows.CharacterID).
		Updates(&savingThrows)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *CharacterRepository) UpdateImage(image *models.CharacterImageModel) error {
	tx := r.DB.Model(&image).
		Clauses(clause.Returning{}).
		Select("*").
		Omit("id", "created_at", "updated_at", "delted_at", "character_id").
		Where("character_id = ?", image.CharacterID).
		Updates(&image)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *CharacterRepository) UpdateCharacterAttributes(attributes []string, character *models.CharacterModel) error {
	tx := r.DB.Model(&models.CharacterModel{}).
		Select(attributes).
		Where("id = ? AND user_id = ?", character.ID, character.UserID).
		Updates(&character)
	if tx.Error != nil {
		return tx.Error
	}
	updatedCharacter, err := r.FindByID(int(character.ID))
	*character = *updatedCharacter
	if err != nil {
		return err
	}
	return nil
}
