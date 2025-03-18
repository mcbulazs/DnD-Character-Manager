package repositories

import (
	"fmt"
	"strings"

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
	var tracker models.CharacterTrackerModel
	tx := r.DB.Model(&models.CharacterTrackerModel{}).Where("id = ?", trackable.ID).First(&tracker)
	if tx.Error != nil {
		return tx.Error
	}
	trackable.Type = models.TrackerEnum.Custom // just in case
	if tracker.Type != models.TrackerEnum.Custom {
		trackable.Name = tracker.Name
	}
	tx = r.DB.Model(&trackable).
		Select("name", "max_value", "current_value").
		Where("id = ? AND character_id = ?", trackable.ID, trackable.CharacterID).
		Updates(&trackable)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *TrackerRepository) UpdateTrackerOrder(characterID int, trackerOrder *[]int) error {
	stringOrder := strings.Join(strings.Split(strings.Trim(fmt.Sprint(*trackerOrder), "[]"), " "), ",") //[1,2,3,4] => "1,2,3,4"
	tx := r.DB.Model(&models.CharacterTrackerModel{}).
		Where("character_id = ? AND type = 'Custom'", characterID).
		Updates(map[string]interface{}{"tracker_order": gorm.Expr("array_position(ARRAY[" + stringOrder + "]::int[], id)")}) // there should be any fear of sql injection
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *TrackerRepository) DeleteTracker(characterID int, trackableID int) error {
	tx := r.DB.Where("id = ? AND character_id = ? AND type = 'Custom'", trackableID, characterID).Delete(&models.CharacterTrackerModel{})
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
