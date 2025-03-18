package models

import (
	"gorm.io/gorm"
)

type TrackerType string

type TrackerEnumStruct struct {
	Health      TrackerType
	Cantrip     TrackerType
	SpellSlot_1 TrackerType
	SpellSlot_2 TrackerType
	SpellSlot_3 TrackerType
	SpellSlot_4 TrackerType
	SpellSlot_5 TrackerType
	SpellSlot_6 TrackerType
	SpellSlot_7 TrackerType
	SpellSlot_8 TrackerType
	SpellSlot_9 TrackerType
	Custom      TrackerType
}

// Initialize the enum with values
var TrackerEnum = TrackerEnumStruct{
	Health:      "Health",
	Cantrip:     "SpellSlot_0",
	SpellSlot_1: "SpellSlot_1",
	SpellSlot_2: "SpellSlot_2",
	SpellSlot_3: "SpellSlot_3",
	SpellSlot_4: "SpellSlot_4",
	SpellSlot_5: "SpellSlot_5",
	SpellSlot_6: "SpellSlot_6",
	SpellSlot_7: "SpellSlot_7",
	SpellSlot_8: "SpellSlot_8",
	SpellSlot_9: "SpellSlot_9",
	Custom:      "Custom",
}

type CharacterTrackerModel struct {
	gorm.Model
	CharacterID  uint
	Name         string
	Type         TrackerType
	MaxValue     int
	CurrentValue int
	TrackerOrder int `gorm:"column:tracker_order"`
}

func (s *CharacterTrackerModel) TableName() string {
	return "character_trackers"
}

func (s *CharacterTrackerModel) BeforeCreate(tx *gorm.DB) error {
	if s.Type != TrackerEnum.Custom {
		return nil
	}
	var prevTracker CharacterTrackerModel
	t := tx.Where("character_id = ?", s.CharacterID).Order("tracker_order desc").First(&prevTracker)
	if t.Error != nil {
		return t.Error
	}
	s.TrackerOrder = prevTracker.TrackerOrder + 1
	return nil
}
