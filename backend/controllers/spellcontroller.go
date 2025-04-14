package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/services"
	"DnDCharacterSheet/utility"
)

type SpellServiceInterface interface {
	CreateSpell(spell *dto.CharacterCreateSpellDTO, characterID int) (*dto.CharacterSpellDTO, error)
	UpdateSpell(spell *dto.CharacterSpellDTO, characterID int) error
	DeleteSpell(spellID int, characterID int) error
}

type SpellController struct {
	Service        SpellServiceInterface
	SessionManager utility.SessionManager
}

func NewSpellController(db *gorm.DB, session utility.SessionManager) *SpellController {
	repo := repositories.NewSpellRepository(db)
	service := services.NewSpellService(repo)
	return &SpellController{
		Service:        service,
		SessionManager: session,
	}
}

func (co *SpellController) CreateSpellHandler(c *gin.Context) {
	characterID := c.MustGet("character_id").(int)
	var createSpellDTO dto.CharacterCreateSpellDTO
	if err := c.ShouldBindJSON(&createSpellDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	spellDTO, err := co.Service.CreateSpell(&createSpellDTO, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, spellDTO)
}

func (co *SpellController) UpdateSpellHandler(c *gin.Context) {
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

	err = co.Service.UpdateSpell(&spellDTO, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func (co *SpellController) DeleteSpellHandler(c *gin.Context) {
	spellID, err := strconv.Atoi(c.Param("spellId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid spell ID"})
		return
	}

	characterID := c.MustGet("character_id").(int)

	err = co.Service.DeleteSpell(spellID, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}
