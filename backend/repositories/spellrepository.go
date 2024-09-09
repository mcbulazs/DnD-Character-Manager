package repositories

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"DnDCharacterSheet/models"
)

type SpellRepository struct {
	DB *gorm.DB
}

func NewSpellRepository(DB *gorm.DB) *SpellRepository {
	return &SpellRepository{
		DB: DB,
	}
}

func (r *SpellRepository) CreateSpell(spell *models.CharacterSpellModel) error {
	tx := r.DB.Create(spell)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *SpellRepository) UpdateSpell(spell *models.CharacterSpellModel) error {
	tx := r.DB.Model(&spell).
		Clauses(clause.Returning{}).
		Select("*").
		Omit("id", "created_at", "updated_at", "delted_at", "character_id").
		Where("id = ? AND character_id = ?", spell.ID, spell.CharacterID).
		Updates(&spell)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *SpellRepository) DeleteSpell(spellID int, characterID int) error {
	tx := r.DB.Where("id = ? AND character_id = ?", spellID, characterID).Delete(&models.CharacterSpellModel{})
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}
