package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/services"
)

func CreateSpellHandler(c *gin.Context, db *gorm.DB) {
	characterID := c.MustGet("character_id").(int)
	var createSpellDTO dto.CharacterCreateSpellDTO
	if err := c.ShouldBindJSON(&createSpellDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	spellService := services.NewSpellService(db)
	spellDTO, err := spellService.CreateSpell(&createSpellDTO, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, spellDTO)
}

func UpdateSpellHandler(c *gin.Context, db *gorm.DB) {
	var spellDTO dto.CharacterSpellDTO
	if err := c.ShouldBindJSON(&spellDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	spellID, err := strconv.Atoi(c.Param("spellId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid spell ID"})
		return
	}
	spellDTO.ID = uint(spellID)

	characterID := c.MustGet("character_id").(int)

	spellService := services.NewSpellService(db)
	err = spellService.UpdateSpell(&spellDTO, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func DeleteSpellHandler(c *gin.Context, db *gorm.DB) {
	spellID, err := strconv.Atoi(c.Param("spellId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid spell ID"})
		return
	}

	characterID := c.MustGet("character_id").(int)

	spellService := services.NewSpellService(db)
	err = spellService.DeleteSpell(spellID, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}
