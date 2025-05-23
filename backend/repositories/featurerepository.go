package repositories

import (
	"strings"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"DnDCharacterSheet/models"
)

type FeatureRepository struct {
	DB *gorm.DB
}

func NewFeatureRepository(db *gorm.DB) *FeatureRepository {
	return &FeatureRepository{DB: db}
}

func (r *FeatureRepository) CreateFeature(feature *models.CharacterFeatureModel) error {
	tx := r.DB.Create(feature)
	if tx.Error != nil {
		if strings.Contains(tx.Error.Error(), "FOREIGN KEY constraint") {
			return gorm.ErrForeignKeyViolated
		}
		return tx.Error
	}
	return nil
}

func (r *FeatureRepository) UpdateFeature(feature *models.CharacterFeatureModel) error {
	tx := r.DB.Model(&feature).
		Clauses(clause.Returning{}).
		Select("*").
		Omit("id", "created_at", "updated_at", "delted_at", "character_id").
		Where("id = ? AND character_id = ?", feature.ID, feature.CharacterID).
		Updates(&feature)
	if tx.Error != nil {
		return tx.Error
	}
	if tx.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *FeatureRepository) DeleteFeature(featureID int, characterID int) error {
	tx := r.DB.Where("id = ? AND character_id = ?", featureID, characterID).Delete(&models.CharacterFeatureModel{})
	if tx.Error != nil {
		return tx.Error
	}
	if tx.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
