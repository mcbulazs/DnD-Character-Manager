package repositories

import (
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
)

type TrackerRepository struct {
	DB *gorm.DB
}

func NewTrackerRepository(DB *gorm.DB) *TrackerRepository {
	return &TrackerRepository{
		DB: DB,
	}
}

func CreateDefaultTrackers(DB *gorm.DB, characterID uint) error {
	defaultTrackers := getDefaultTrackers(characterID)
	tx := DB.Create(&defaultTrackers)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *TrackerRepository) CreateTracker(trackable *models.CharacterTrackerModel) error {
	trackable.Type = models.TrackerEnum.Custom
	tx := r.DB.Create(&trackable)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *TrackerRepository) UpdateTracker(trackable *models.CharacterTrackerModel) error {
	tx := r.DB.Model(&trackable).
		Select("name", "max_value", "current_value").
		Where("id = ?", trackable.ID).
		Updates(&trackable)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *TrackerRepository) DeleteTracker(trackableID int, characterID int) error {
	tx := r.DB.Where("id = ? AND character_id = ? AND type = Custom", trackableID, characterID).Delete(&models.CharacterTrackerModel{})
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func getDefaultTrackers(characterID uint) []models.CharacterTrackerModel {
	trackers := []models.CharacterTrackerModel{
		{
			Name:         "Health",
			MaxValue:     10,
			CurrentValue: 10,
			Type:         models.TrackerEnum.Health,
			CharacterID:  characterID,
		},
		{
			Name:         "Cantrip",
			MaxValue:     1,
			CurrentValue: 1,
			Type:         models.TrackerEnum.Cantrip,
			CharacterID:  characterID,
		},
		{
			Name:         "Spell Slot 1",
			MaxValue:     0,
			CurrentValue: 0,
			Type:         models.TrackerEnum.SpellSlot_1,
			CharacterID:  characterID,
		},
		{
			Name:         "Spell Slot 2",
			MaxValue:     0,
			CurrentValue: 0,
			Type:         models.TrackerEnum.SpellSlot_2,
			CharacterID:  characterID,
		},
		{
			Name:         "Spell Slot 3",
			MaxValue:     0,
			CurrentValue: 0,
			Type:         models.TrackerEnum.SpellSlot_3,
			CharacterID:  characterID,
		},
		{
			Name:         "Spell Slot 4",
			MaxValue:     0,
			CurrentValue: 0,
			Type:         models.TrackerEnum.SpellSlot_4,
			CharacterID:  characterID,
		},
		{
			Name:         "Spell Slot 5",
			MaxValue:     0,
			CurrentValue: 0,
			Type:         models.TrackerEnum.SpellSlot_5,
			CharacterID:  characterID,
		},
		{
			Name:         "Spell Slot 6",
			MaxValue:     0,
			CurrentValue: 0,
			Type:         models.TrackerEnum.SpellSlot_6,
			CharacterID:  characterID,
		},
		{
			Name:         "Spell Slot 7",
			MaxValue:     0,
			CurrentValue: 0,
			Type:         models.TrackerEnum.SpellSlot_7,
			CharacterID:  characterID,
		},
		{
			Name:         "Spell Slot 8",
			MaxValue:     0,
			CurrentValue: 0,
			Type:         models.TrackerEnum.SpellSlot_8,
			CharacterID:  characterID,
		},
		{
			Name:         "Spell Slot 9",
			MaxValue:     0,
			CurrentValue: 0,
			Type:         models.TrackerEnum.SpellSlot_9,
			CharacterID:  characterID,
		},
	}
	return trackers
}
