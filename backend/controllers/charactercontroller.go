package controllers

import (
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

	err := service.CreateCharacter(&character, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, character)
}

func GetCharactersHandler(c *gin.Context, db *gorm.DB) {
	service := services.NewCharacterService(db)
	userID := c.MustGet("user_id").(int)

	characters, err := service.FindCharactersByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, characters)
}

func GetCharacterHandler(c *gin.Context, db *gorm.DB) {
	service := services.NewCharacterService(db)

	characterID, err := strconv.Atoi(c.Param("id"))
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

func SetCharacterFavoriteHandler(c *gin.Context, db *gorm.DB) {
	service := services.NewCharacterService(db)

	characterID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		return
	}
	userId := c.MustGet("user_id").(int)
	character, err := service.SetFavorite(characterID, userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, character)
}