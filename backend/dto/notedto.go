package dto

type CharacterNoteCategoryDTO struct {
	ID          uint               `json:"id"`
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Notes       []CharacterNoteDTO `json:"notes"`
}

type CharacterCreateNoteCategoryDTO struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type CharacterNoteDTO struct {
	ID   uint   `json:"id"`
	Note string `json:"note"`
}
