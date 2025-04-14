package controllers

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/services"
	"DnDCharacterSheet/utility"
)

type CharacterServiceInterface interface {
	IsUserCharacter(userID int, characterID int) bool
	CreateCharacter(character *dto.CreateCharacterDTO, userID int) (*dto.CharacterDTO, error)
	DeleteCharacter(characterID int, userID int) error
	UpdateCharacterAbilityScores(abilityScores *dto.CharacterAbilityScoreDTO, characterID int) error
	UpdateCharacterSkills(skills *dto.CharacterSkillDTO, characterID int) error
	UpdateCharacterAttribute(attributesValue []string, character *dto.CharacterDTO, characterID int, userID int) error
	UpdateCharacterSavingThrows(savingThrows *dto.CharacterSavingThrowDTO, characterID int) error
	UpdateCharacterImage(image *dto.CharacterImageDTO, characterID int) error
	UpdateCharacterOptions(options *dto.CharacterOptionsDTO, characterID int) error
	FindCharacterByID(id int, userID int) (*dto.CharacterDTO, error)
}

type CharacterController struct {
	Service        CharacterServiceInterface
	SessionManager utility.SessionManager
}

func NewCharacterController(db *gorm.DB, session utility.SessionManager) *CharacterController {
	repo := repositories.NewCharacterRepository(db)
	service := services.NewCharacterService(repo)
	return &CharacterController{
		Service:        service,
		SessionManager: session,
	}
}

func (co *CharacterController) CreateCharacterHandler(c *gin.Context) {
	var character dto.CreateCharacterDTO
	if err := c.ShouldBindJSON(&character); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := co.SessionManager.GetUserIdBySession(c)

	characterDTO, err := co.Service.CreateCharacter(&character, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, characterDTO)
}

func (co *CharacterController) DeleteCharacterHandler(c *gin.Context) {
	characterID, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		return
	}
	userID := co.SessionManager.GetUserIdBySession(c)

	err = co.Service.DeleteCharacter(characterID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

func (co *CharacterController) UpdateCharacterAttribute(c *gin.Context) {
	// Read the request body into a byte slice
	bodyBytes, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Unmarshal the JSON body into a map to get the keys
	var body map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	attributes := make([]string, 0, len(body))
	for key := range body {
		attributes = append(attributes, key)
	}

	// Unmarshal the JSON body into a CharacterDTO struct to get the character data
	var character dto.CharacterDTO
	if err := json.Unmarshal(bodyBytes, &character); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	characterID := c.MustGet("character_id").(int)
	userID := co.SessionManager.GetUserIdBySession(c)

	err = co.Service.UpdateCharacterAttribute(attributes, &character, characterID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, character)
}

func (co *CharacterController) UpdateCharacterAbilityScoresHandler(c *gin.Context) {
	var abilityScores dto.CharacterAbilityScoreDTO
	if err := c.ShouldBindJSON(&abilityScores); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	characterID := c.MustGet("character_id").(int)

	err := co.Service.UpdateCharacterAbilityScores(&abilityScores, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, abilityScores)
}

func (co *CharacterController) UpdateCharacterSkillsHandler(c *gin.Context) {
	var skills dto.CharacterSkillDTO
	if err := c.ShouldBindJSON(&skills); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	characterID := c.MustGet("character_id").(int)

	err := co.Service.UpdateCharacterSkills(&skills, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, skills)
}

func (co *CharacterController) UpdateCharacterSavingThrowsHandler(c *gin.Context) {
	var savingThrows dto.CharacterSavingThrowDTO
	if err := c.ShouldBindJSON(&savingThrows); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	characterID := c.MustGet("character_id").(int)

	err := co.Service.UpdateCharacterSavingThrows(&savingThrows, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, savingThrows)
}

func (co *CharacterController) UpdateCharacterImageHandler(c *gin.Context) {
	var image dto.CharacterImageDTO
	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	characterID := c.MustGet("character_id").(int)

	err := co.Service.UpdateCharacterImage(&image, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, image)
}

func (co *CharacterController) UpdateCharacterOptionsHandler(c *gin.Context) {
	var options dto.CharacterOptionsDTO
	if err := c.ShouldBindJSON(&options); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	characterID := c.MustGet("character_id").(int)

	err := co.Service.UpdateCharacterOptions(&options, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, options)
}

func (co *CharacterController) GetCharacterHandler(c *gin.Context) {
	characterID, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		return
	}
	userId := co.SessionManager.GetUserIdBySession(c)
	character, err := co.Service.FindCharacterByID(characterID, userId)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusForbidden, gin.H{"error": "Character not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, character)
}

func (co CharacterController) CharacterMiddleware(c *gin.Context) {
	characterID, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		c.Abort()
		return
	}

	c.Set("character_id", characterID)
	userId := co.SessionManager.GetUserIdBySession(c)
	isOwner := co.Service.IsUserCharacter(userId, characterID)
	if !isOwner {
		c.JSON(http.StatusForbidden, gin.H{"error": "User is not the owner of the character"})
		c.Abort()
		return
	}
	c.Next()
}
