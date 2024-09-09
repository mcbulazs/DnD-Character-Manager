package dto

type CharacterSpellDTO struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Level       int    `json:"level"`
	School      string `json:"school"`
	CastingTime string `json:"castingTime"`
	Range       string `json:"range"`
	Components  string `json:"components"`
	Duration    string `json:"duration"`
	Description string `json:"description"`
	Active      bool   `json:"active"`
}

type CharacterCreateSpellDTO struct {
	Name        string `json:"name"`
	Level       int    `json:"level"`
	School      string `json:"school"`
	CastingTime string `json:"castingTime"`
	Range       string `json:"range"`
	Components  string `json:"components"`
	Duration    string `json:"duration"`
	Description string `json:"description"`
}
