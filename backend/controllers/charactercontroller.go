package controllers

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/services"
)

func CreateCharacterHandler(c *gin.Context, db *gorm.DB) {
	var character dto.CreateCharacterDTO
	if err := c.ShouldBindJSON(&character); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	service := services.NewCharacterService(db)
	userID := c.MustGet("user_id").(int)

	characterDTO, err := service.CreateCharacter(&character, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, characterDTO)
}

func DeleteCharacterHandler(c *gin.Context, db *gorm.DB) {
	characterID, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		return
	}
	userID := c.MustGet("user_id").(int)

	service := services.NewCharacterService(db)
	err = service.DeleteCharacter(characterID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

func UpdateCharacterAttribute(c *gin.Context, db *gorm.DB) {
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

	service := services.NewCharacterService(db)
	characterID := c.MustGet("character_id").(int)
	userID := c.MustGet("user_id").(int)

	err = service.UpdateCharacterAttribute(attributes, &character, characterID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, character)
}

func UpdateCharacterAbilityScoresHandler(c *gin.Context, db *gorm.DB) {
	var abilityScores dto.CharacterAbilityScoreDTO
	if err := c.ShouldBindJSON(&abilityScores); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	service := services.NewCharacterService(db)
	characterID := c.MustGet("character_id").(int)

	err := service.UpdateCharacterAbilityScores(&abilityScores, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, abilityScores)
}

func UpdateCharacterSkillsHandler(c *gin.Context, db *gorm.DB) {
	var skills dto.CharacterSkillDTO
	if err := c.ShouldBindJSON(&skills); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	service := services.NewCharacterService(db)
	characterID := c.MustGet("character_id").(int)

	err := service.UpdateCharacterSkills(&skills, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, skills)
}

func UpdateCharacterSavingThrowsHandler(c *gin.Context, db *gorm.DB) {
	var savingThrows dto.CharacterSavingThrowDTO
	if err := c.ShouldBindJSON(&savingThrows); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	service := services.NewCharacterService(db)
	characterID := c.MustGet("character_id").(int)

	err := service.UpdateCharacterSavingThrows(&savingThrows, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, savingThrows)
}

func UpdateCharacterImageHandler(c *gin.Context, db *gorm.DB) {
	var image dto.CharacterImageDTO
	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	service := services.NewCharacterService(db)
	characterID := c.MustGet("character_id").(int)

	err := service.UpdateCharacterImage(&image, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, image)
}

func GetCharacterHandler(c *gin.Context, db *gorm.DB) {
	service := services.NewCharacterService(db)

	characterID, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		return
	}
	userId := c.MustGet("user_id").(int)
	character, err := service.FindCharacterByID(characterID, userId)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Character not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, character)
}
