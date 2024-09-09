package models

import "gorm.io/gorm"

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
	Cantrip:     "Cantrip",
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
}

func (s *CharacterTrackerModel) TableName() string {
	return "character_trackers"
}
