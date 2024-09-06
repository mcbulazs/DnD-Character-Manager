package dto

type CharacterBaseDTO struct {
	ID         uint              `json:"id"`
	Name       string            `json:"name"`
	Class      string            `json:"class"`
	IsFavorite bool              `json:"isFavorite"`
	Image      CharacterImageDTO `json:"image"`
}

type CreateCharacterDTO struct {
	Name  string            `json:"name"`
	Class string            `json:"class"`
	Image CharacterImageDTO `json:"image"`
}

type CharacterDTO struct {
	ID                uint                     `json:"ID"`
	Name              string                   `json:"name"`
	Class             string                   `json:"class"`
	Race              string                   `json:"race"`
	Level             int                      `json:"level"`
	IsFavorite        bool                     `json:"isFavorite"`
	Image             CharacterImageDTO        `json:"image"`
	ArmorClass        int                      `json:"armorClass"`
	Initiative        int                      `json:"initiative"`
	Speed             int                      `json:"speed"`
	PassivePerception int                      `json:"passivePerception"`
	ProficiencyBonus  int                      `json:"proficiencyBonus"`
	AbilityScores     CharacterAbilityScoreDTO `json:"abilityScores"`
	SavingThrows      CharacterSavingThrowDTO  `json:"savingThrows"`
	Skills            CharacterSkillDTO        `json:"skills"`
	Features          []CharacterFeatureDTO    `json:"features"`
}

type CharacterImageDTO struct {
	BackgroundImage    string `json:"backgroundImage"`
	BackgroundSize     string `json:"backgroundSize"`
	BackgroundPosition string `json:"backgroundPosition"`
}

type Attribute struct {
	Value    int `json:"value"`
	Modifier int `json:"modifier"`
}

type ProficientAttribute struct {
	Modifier   int  `json:"modifier"`
	Proficient bool `json:"proficient"`
}

type Skill struct {
	ProficientAttribute
	Expertise bool `json:"expertise"`
}

type CharacterAbilityScoreDTO struct {
	Strength     Attribute `json:"strength"`
	Dexterity    Attribute `json:"dexterity"`
	Constitution Attribute `json:"constitution"`
	Intelligence Attribute `json:"intelligence"`
	Wisdom       Attribute `json:"wisdom"`
	Charisma     Attribute `json:"charisma"`
}

type CharacterSavingThrowDTO struct {
	Strength     ProficientAttribute `json:"strength"`
	Dexterity    ProficientAttribute `json:"dexterity"`
	Constitution ProficientAttribute `json:"constitution"`
	Intelligence ProficientAttribute `json:"intelligence"`
	Wisdom       ProficientAttribute `json:"wisdom"`
	Charisma     ProficientAttribute `json:"charisma"`
}

type CharacterSkillDTO struct {
	Acrobatics     Skill `json:"acrobatics"`
	AnimalHandling Skill `json:"animalHandling"`
	Arcana         Skill `json:"arcana"`
	Athletics      Skill `json:"athletics"`
	Deception      Skill `json:"deception"`
	History        Skill `json:"history"`
	Insight        Skill `json:"insight"`
	Intimidation   Skill `json:"intimidation"`
	Investigation  Skill `json:"investigation"`
	Medicine       Skill `json:"medicine"`
	Nature         Skill `json:"nature"`
	Perception     Skill `json:"perception"`
	Performance    Skill `json:"performance"`
	Persuasion     Skill `json:"persuasion"`
	Religion       Skill `json:"religion"`
	SleightOfHand  Skill `json:"sleightOfHand"`
	Stealth        Skill `json:"stealth"`
	Survival       Skill `json:"survival"`
}

type CharacterFeatureDTO struct {
	ID          uint   `json:"id"`
	CharacterID uint   `json:"characterID"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Source      string `json:"source"`
}

type CharacterCreateFeatureDTO struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Source      string `json:"source"`
}
