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

type FeatureServiceInterface interface {
	CreateFeature(feature *dto.CharacterCreateFeatureDTO, characterID int) (*dto.CharacterFeatureDTO, error)
	UpdateFeature(feature *dto.CharacterFeatureDTO, characterID int) error
	DeleteFeature(featureID int, characterID int) error
}

type FeatureController struct {
	Service        FeatureServiceInterface
	SessionManager utility.SessionManager
}

func NewFeatureController(db *gorm.DB, session utility.SessionManager) *FeatureController {
	repo := repositories.NewFeatureRepository(db)
	service := services.NewFeatureService(repo)
	return &FeatureController{
		Service:        service,
		SessionManager: session,
	}
}

func (co *FeatureController) CreateFeatureHandler(c *gin.Context) {
	characterID := c.MustGet("character_id").(int)
	var createFeatureDTO dto.CharacterCreateFeatureDTO
	if err := c.ShouldBindJSON(&createFeatureDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	featureDTO, err := co.Service.CreateFeature(&createFeatureDTO, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, featureDTO)
}

func (co *FeatureController) UpdateFeatureHandler(c *gin.Context) {
	var featureDTO dto.CharacterFeatureDTO
	if err := c.ShouldBindJSON(&featureDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	featureID, err := strconv.Atoi(c.Param("featureId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid feature ID"})
		return
	}
	featureDTO.ID = uint(featureID)

	characterID := c.MustGet("character_id").(int)

	err = co.Service.UpdateFeature(&featureDTO, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Feature updated successfully"})
}

func (co *FeatureController) DeleteFeatureHandler(c *gin.Context) {
	featureID, err := strconv.Atoi(c.Param("featureId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid feature ID"})
		return
	}

	characterID := c.MustGet("character_id").(int)
	err = co.Service.DeleteFeature(featureID, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Feature deleted successfully"})
}
