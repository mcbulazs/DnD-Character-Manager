package services

import (
	"slices"
	"strings"

	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
)

type CharacterRepositoryInterface interface {
	FindByID(characterID int) (*models.CharacterModel, error)
	IsUserCharacter(userID int, characterID int) bool
	Create(character *models.CharacterModel) error
	Delete(characterID int, userID int) error
	UpdateAbilityScores(abilityScores *models.CharacterAbilityScoreModel) error
	UpdateSkills(skills *models.CharacterSkillModel) error
	UpdateSavingThrows(savingThrows *models.CharacterSavingThrowModel) error
	UpdateImage(image *models.CharacterImageModel) error
	UpdateCharacterAttributes(attributes []string, character *models.CharacterModel) error
	UpdateCharacterOptions(options *models.CharacterOptionsModel) error
}

type CharacterService struct {
	Repo CharacterRepositoryInterface
}

func NewCharacterService(repo CharacterRepositoryInterface) *CharacterService {
	return &CharacterService{
		Repo: repo,
	}
}

func (s *CharacterService) IsUserCharacter(userID int, characterID int) bool {
	return s.Repo.IsUserCharacter(userID, characterID)
}

func (s *CharacterService) CreateCharacter(character *dto.CreateCharacterDTO, userID int) (*dto.CharacterDTO, error) {
	characterModel := models.CharacterModel{
		Name:  character.Name,
		Class: character.Class,
		Race:  character.Race,
		Image: convertToCharacterImageModel(&character.Image),
	}
	characterModel.UserID = uint(userID)
	err := s.Repo.Create(&characterModel)
	if err != nil {
		return nil, err
	}
	characterDTO := convertToCharacterDTO(&characterModel)
	return characterDTO, nil
}

func (s *CharacterService) DeleteCharacter(characterID int, userID int) error {
	err := s.Repo.Delete(characterID, userID)
	if err != nil {
		return err
	}
	return nil
}

func (s *CharacterService) UpdateCharacterAbilityScores(abilityScores *dto.CharacterAbilityScoreDTO, characterID int) error {
	abilityScoresModel := convertToCharacterAbilityScoreModel(abilityScores)
	abilityScoresModel.CharacterID = uint(characterID)
	err := s.Repo.UpdateAbilityScores(&abilityScoresModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *CharacterService) UpdateCharacterSkills(skills *dto.CharacterSkillDTO, characterID int) error {
	skillsModel := convertToCharacterSkillModel(skills)
	skillsModel.CharacterID = uint(characterID)
	err := s.Repo.UpdateSkills(&skillsModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *CharacterService) UpdateCharacterAttribute(attributesValue []string, character *dto.CharacterDTO, characterID int, userID int) error {
	characterModel := convertToCharacterModel(character)
	characterModel.ID = uint(characterID)
	characterModel.UserID = uint(userID)
	attributes := make([]string, len(attributesValue))
	for _, attribute := range attributesValue {
		attr := strings.ToUpper(string(attribute[0])) + attribute[1:]
		if slices.Contains([]string{"*", "ID", "CreatedAt", "UpdatedAt", "DeletedAt", "UserID", "Id"}, attr) {
			continue
		}
		attributes = append(attributes, attr)
	}
	err := s.Repo.UpdateCharacterAttributes(attributes, characterModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *CharacterService) UpdateCharacterSavingThrows(savingThrows *dto.CharacterSavingThrowDTO, characterID int) error {
	savingThrowsModel := convertToCharacterSavingThrowModel(savingThrows)
	savingThrowsModel.CharacterID = uint(characterID)
	err := s.Repo.UpdateSavingThrows(&savingThrowsModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *CharacterService) UpdateCharacterImage(image *dto.CharacterImageDTO, characterID int) error {
	imageModel := convertToCharacterImageModel(image)
	imageModel.CharacterID = uint(characterID)
	err := s.Repo.UpdateImage(&imageModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *CharacterService) UpdateCharacterOptions(options *dto.CharacterOptionsDTO, characterID int) error {
	optionsModel := convertToCharacterOptionsModel(options)
	optionsModel.CharacterID = uint(characterID)
	err := s.Repo.UpdateCharacterOptions(optionsModel)
	if err != nil {
		return err
	}
	return nil
}

func (s *CharacterService) FindCharacterByID(id int, userID int) (*dto.CharacterDTO, error) {
	characterModel, err := s.Repo.FindByID(id)
	if characterModel == nil {
		return nil, err
	}

	characterDTO := convertToCharacterDTO(characterModel)
	if characterModel.UserID == uint(userID) {
		return characterDTO, nil
	} else {
		for _, frined := range characterModel.SharedWith {
			if frined.FriendID == uint(userID) {
				characterDTO.IsOwner = false
				characterDTO.SharedWith = nil
				return characterDTO, nil
			}
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func convertToCharacterImageDTO(image *models.CharacterImageModel) dto.CharacterImageDTO {
	return dto.CharacterImageDTO{
		BackgroundImage:    image.BackgroundImage,
		BackgroundSize:     image.BackgroundSize,
		BackgroundPosition: image.BackgroundPosition,
	}
}

func convertToCharacterImageModel(image *dto.CharacterImageDTO) models.CharacterImageModel {
	return models.CharacterImageModel{
		BackgroundImage:    image.BackgroundImage,
		BackgroundSize:     image.BackgroundSize,
		BackgroundPosition: image.BackgroundPosition,
	}
}

func convertToCharacterBaseDTO(character *models.CharacterModel) *dto.CharacterBaseDTO {
	return &dto.CharacterBaseDTO{
		ID:         character.ID,
		Name:       character.Name,
		Class:      character.Class,
		IsFavorite: character.IsFavorite,
		Image:      convertToCharacterImageDTO(&character.Image),
	}
}

func convertToCharacterBaseDTOs(characters []models.CharacterModel) []dto.CharacterBaseDTO {
	dtos := make([]dto.CharacterBaseDTO, len(characters))
	for i, character := range characters {
		dtos[i] = *convertToCharacterBaseDTO(&character)
	}
	return dtos
}

func convertToAttributeDTO(attribute *models.Attribute) dto.Attribute {
	return dto.Attribute{Value: attribute.Value, Modifier: attribute.Modifier}
}

func convertToAttributeModek(attribute *dto.Attribute) models.Attribute {
	return models.Attribute{Value: attribute.Value, Modifier: attribute.Modifier}
}

func convertToProficientAttributeDTO(proficientAttribute *models.ProficientAttribute) dto.ProficientAttribute {
	return dto.ProficientAttribute{Modifier: proficientAttribute.Modifier, Proficient: proficientAttribute.Proficient}
}

func convertToProficientAttributeModel(proficientAttribute *dto.ProficientAttribute) models.ProficientAttribute {
	return models.ProficientAttribute{Modifier: proficientAttribute.Modifier, Proficient: proficientAttribute.Proficient}
}

func convertToSkillDTO(skill *models.Skill) dto.Skill {
	return dto.Skill{ProficientAttribute: convertToProficientAttributeDTO(&skill.ProficientAttribute), Expertise: skill.Expertise}
}

func convertToSkillModel(skill *dto.Skill) models.Skill {
	return models.Skill{ProficientAttribute: convertToProficientAttributeModel(&skill.ProficientAttribute), Expertise: skill.Expertise}
}

func convertToCharacterAbilityScoreDTO(abilityScores *models.CharacterAbilityScoreModel) dto.CharacterAbilityScoreDTO {
	return dto.CharacterAbilityScoreDTO{
		Strength:     convertToAttributeDTO(&abilityScores.Strength),
		Dexterity:    convertToAttributeDTO(&abilityScores.Dexterity),
		Constitution: convertToAttributeDTO(&abilityScores.Constitution),
		Intelligence: convertToAttributeDTO(&abilityScores.Intelligence),
		Wisdom:       convertToAttributeDTO(&abilityScores.Wisdom),
		Charisma:     convertToAttributeDTO(&abilityScores.Charisma),
	}
}

func convertToCharacterAbilityScoreModel(abilityScores *dto.CharacterAbilityScoreDTO) models.CharacterAbilityScoreModel {
	return models.CharacterAbilityScoreModel{
		Strength:     convertToAttributeModek(&abilityScores.Strength),
		Dexterity:    convertToAttributeModek(&abilityScores.Dexterity),
		Constitution: convertToAttributeModek(&abilityScores.Constitution),
		Intelligence: convertToAttributeModek(&abilityScores.Intelligence),
		Wisdom:       convertToAttributeModek(&abilityScores.Wisdom),
		Charisma:     convertToAttributeModek(&abilityScores.Charisma),
	}
}

func convertToCharacterSavingThrowDTO(savingThrows *models.CharacterSavingThrowModel) dto.CharacterSavingThrowDTO {
	return dto.CharacterSavingThrowDTO{
		Strength:     convertToProficientAttributeDTO(&savingThrows.Strength),
		Dexterity:    convertToProficientAttributeDTO(&savingThrows.Dexterity),
		Constitution: convertToProficientAttributeDTO(&savingThrows.Constitution),
		Intelligence: convertToProficientAttributeDTO(&savingThrows.Intelligence),
		Wisdom:       convertToProficientAttributeDTO(&savingThrows.Wisdom),
		Charisma:     convertToProficientAttributeDTO(&savingThrows.Charisma),
	}
}

func convertToCharacterSavingThrowModel(savingThrows *dto.CharacterSavingThrowDTO) models.CharacterSavingThrowModel {
	return models.CharacterSavingThrowModel{
		Strength:     convertToProficientAttributeModel(&savingThrows.Strength),
		Dexterity:    convertToProficientAttributeModel(&savingThrows.Dexterity),
		Constitution: convertToProficientAttributeModel(&savingThrows.Constitution),
		Intelligence: convertToProficientAttributeModel(&savingThrows.Intelligence),
		Wisdom:       convertToProficientAttributeModel(&savingThrows.Wisdom),
		Charisma:     convertToProficientAttributeModel(&savingThrows.Charisma),
	}
}

func convertToCharacterSkillDTO(skills *models.CharacterSkillModel) dto.CharacterSkillDTO {
	return dto.CharacterSkillDTO{
		Acrobatics:     convertToSkillDTO(&skills.Acrobatics),
		AnimalHandling: convertToSkillDTO(&skills.AnimalHandling),
		Arcana:         convertToSkillDTO(&skills.Arcana),
		Athletics:      convertToSkillDTO(&skills.Athletics),
		Deception:      convertToSkillDTO(&skills.Deception),
		History:        convertToSkillDTO(&skills.History),
		Insight:        convertToSkillDTO(&skills.Insight),
		Intimidation:   convertToSkillDTO(&skills.Intimidation),
		Investigation:  convertToSkillDTO(&skills.Investigation),
		Medicine:       convertToSkillDTO(&skills.Medicine),
		Nature:         convertToSkillDTO(&skills.Nature),
		Perception:     convertToSkillDTO(&skills.Perception),
		Performance:    convertToSkillDTO(&skills.Performance),
		Persuasion:     convertToSkillDTO(&skills.Persuasion),
		Religion:       convertToSkillDTO(&skills.Religion),
		SleightOfHand:  convertToSkillDTO(&skills.SleightOfHand),
		Stealth:        convertToSkillDTO(&skills.Stealth),
		Survival:       convertToSkillDTO(&skills.Survival),
	}
}

func convertToCharacterSkillModel(skills *dto.CharacterSkillDTO) models.CharacterSkillModel {
	return models.CharacterSkillModel{
		Acrobatics:     convertToSkillModel(&skills.Acrobatics),
		AnimalHandling: convertToSkillModel(&skills.AnimalHandling),
		Arcana:         convertToSkillModel(&skills.Arcana),
		Athletics:      convertToSkillModel(&skills.Athletics),
		Deception:      convertToSkillModel(&skills.Deception),
		History:        convertToSkillModel(&skills.History),
		Insight:        convertToSkillModel(&skills.Insight),
		Intimidation:   convertToSkillModel(&skills.Intimidation),
		Investigation:  convertToSkillModel(&skills.Investigation),
		Medicine:       convertToSkillModel(&skills.Medicine),
		Nature:         convertToSkillModel(&skills.Nature),
		Perception:     convertToSkillModel(&skills.Perception),
		Performance:    convertToSkillModel(&skills.Performance),
		Persuasion:     convertToSkillModel(&skills.Persuasion),
		Religion:       convertToSkillModel(&skills.Religion),
		SleightOfHand:  convertToSkillModel(&skills.SleightOfHand),
		Stealth:        convertToSkillModel(&skills.Stealth),
		Survival:       convertToSkillModel(&skills.Survival),
	}
}

func convertToCharacterDTO(character *models.CharacterModel) *dto.CharacterDTO {
	characterModel := dto.CharacterDTO{
		ID:                character.ID,
		IsOwner:           true,
		Name:              character.Name,
		Class:             character.Class,
		Race:              character.Race,
		Level:             character.Level,
		IsFavorite:        character.IsFavorite,
		ArmorClass:        character.ArmorClass,
		Initiative:        character.Initiative,
		Speed:             character.Speed,
		PassivePerception: character.PassivePerception,
		ProficiencyBonus:  character.ProficiencyBonus,
		Image:             convertToCharacterImageDTO(&character.Image),
		Options:           *convertToCharacterOptionsDTO(&character.Options),
		AbilityScores:     convertToCharacterAbilityScoreDTO(&character.AbilityScores),
		SavingThrows:      convertToCharacterSavingThrowDTO(&character.SavingThrows),
		Skills:            convertToCharacterSkillDTO(&character.Skills),
		Features:          convertToCharacterFeatureDTOs(character.Features),
		Spells:            convertToCharacterSpellDTOs(character.Spells),
		Trackers:          convertToCharacterTrackerDTOs(character.Trackers),
		NoteCategories:    convertToCharacterNoteCategoryDTOs(character.NoteCategories),
	}
	for _, friend := range character.SharedWith {
		friendDTO := dto.FriendDTO{
			Friend: *convertToUserDataDTO(&friend.Friend),
			Name:   friend.Name,
			Note:   friend.Note,
		}
		characterModel.SharedWith = append(characterModel.SharedWith, friendDTO)
	}

	return &characterModel
}

func convertToCharacterModel(character *dto.CharacterDTO) *models.CharacterModel {
	char := models.CharacterModel{
		Name:              character.Name,
		Class:             character.Class,
		Race:              character.Race,
		Level:             character.Level,
		ArmorClass:        character.ArmorClass,
		IsFavorite:        character.IsFavorite,
		Initiative:        character.Initiative,
		Speed:             character.Speed,
		PassivePerception: character.PassivePerception,
		ProficiencyBonus:  character.ProficiencyBonus,
	}
	char.ID = character.ID
	return &char
}

func convertToCharacterOptionsModel(options *dto.CharacterOptionsDTO) *models.CharacterOptionsModel {
	return &models.CharacterOptionsModel{
		IsCaster:   options.IsCaster,
		IsDead:     options.IsDead,
		IsXp:       options.IsXP,
		RollOption: options.RollOption,
	}
}

func convertToCharacterOptionsDTO(options *models.CharacterOptionsModel) *dto.CharacterOptionsDTO {
	return &dto.CharacterOptionsDTO{
		IsCaster:   options.IsCaster,
		IsDead:     options.IsDead,
		IsXP:       options.IsXp,
		RollOption: options.RollOption,
	}
}
