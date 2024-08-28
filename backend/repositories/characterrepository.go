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

	tx.Commit()
	return nil
}

func (r *CharacterRepository) FindByID(id int) (*models.CharacterModel, error) {
	var character models.CharacterModel
	tx := r.DB.Preload("Image").First(&character, id)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &character, nil
}

func (r *CharacterRepository) FindByUserID(userID uint) ([]models.CharacterModel, error) {
	var characters []models.CharacterModel
	err := r.DB.Where("user_id = ?", userID).Order("is_favorite DESC").Preload("Image").Find(&characters).Error
	if err != nil {
		return nil, err
	}
	return characters, nil
}

func (r *CharacterRepository) Update(character *models.CharacterModel, userID int) error {
	tx := r.DB.
		Omit("user_id").
		Clauses(clause.Returning{}).
		Where("id = ? AND user_id = ?", character.ID, userID).
		Save(&character)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *CharacterRepository) SetFavorite(id int, userID int) error {
	tx := r.DB.Model(&models.CharacterModel{}).
		Where("id = ? AND user_id = ?", id, userID).
		Update("is_favorite", gorm.Expr("NOT is_favorite"))
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}
