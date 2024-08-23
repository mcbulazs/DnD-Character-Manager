package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
	"DnDCharacterSheet/services"
)

func CreateCharacterHandler(c *gin.Context, db *gorm.DB) {
	var character models.Character
	if err := c.ShouldBindJSON(&character); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	characterService := services.NewCharacterService(db)
	user_id := c.MustGet("user_id")
	character.UserID = uint(user_id.(int))

	err := characterService.CreateCharacter(&character)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, character)
}

func GetCharactersHandler(c *gin.Context, db *gorm.DB) {
	characterService := services.NewCharacterService(db)
	user_id := c.MustGet("user_id")
	characters, err := characterService.FindCharactersByUserID(uint(user_id.(int)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, characters)
}

func GetCharacterHandler(c *gin.Context, db *gorm.DB) {
	characterService := services.NewCharacterService(db)

	characterID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		return
	}
	character, err := characterService.FindCharacterByID(characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if character.UserID != uint(c.MustGet("user_id").(int)) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to view this character"})
		return
	}

	c.JSON(http.StatusOK, character)
}

func SetCharacterFavoriteHandler(c *gin.Context, db *gorm.DB) {
	characterService := services.NewCharacterService(db)

	characterID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		return
	}
	character, err := characterService.FindCharacterByID(characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = characterService.SetFavorite(character)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, character)
}
