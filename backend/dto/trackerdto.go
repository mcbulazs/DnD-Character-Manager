package dto

import "DnDCharacterSheet/models"

type CharacterTrackerDTO struct {
	ID           uint               `json:"id"`
	Name         string             `json:"name"`
	Type         models.TrackerType `json:"type"`
	MaxValue     int                `json:"maxValue"`
	CurrentValue int                `json:"currentValue"`
}

type CreateCharacterTrackerDTO struct {
	Name     string `json:"name"`
	MaxValue int    `json:"maxValue"`
}
