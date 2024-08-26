package dto

import "DnDCharacterSheet/models"

type CharacterBaseDTO struct {
	ID         uint              `json:"id"`
	Name       string            `json:"name"`
	Class      string            `json:"class"`
	IsFavorite bool              `json:"is_favorite"`
	Image      CharacterImageDTO `json:"image"`
}

type CreateCharacterDTO struct {
	Name  string            `json:"name"`
	Class string            `json:"class"`
	Image CharacterImageDTO `json:"image"`
}

type CharacterDTO struct {
	ID            uint                         `json:"id"`
	Name          string                       `json:"name"`
	Class         string                       `json:"class"`
	IsFavorite    bool                         `json:"is_favorite"`
	Image         CharacterImageDTO            `json:"image"`
	AbilityScores models.CharacterAbilityScoreModel `json:"ability_scores"`
}

type CharacterImageDTO struct {
	BackgroundImage    string `json:"background_image"`
	BackgroundSize     string `json:"background_size"`
	BackgroundPosition string `json:"background_position"`
}
