package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/services"
)

func GetFeaturesHandler(c *gin.Context, db *gorm.DB) {
	characterID := c.MustGet("character_id").(int)
	featureService := services.NewFeatureService(db)
	features, err := featureService.GetFeatures(characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, features)
}

func CreateFeatureHandler(c *gin.Context, db *gorm.DB) {
	characterID := c.MustGet("character_id").(int)
	var createFeatureDTO dto.CharacterCreateFeatureDTO
	if err := c.ShouldBindJSON(&createFeatureDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	featureService := services.NewFeatureService(db)
	featureDTO, err := featureService.CreateFeature(&createFeatureDTO, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, featureDTO)
}

func UpdateFeatureHandler(c *gin.Context, db *gorm.DB) {
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

	featureService := services.NewFeatureService(db)
	err = featureService.UpdateFeature(&featureDTO, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Feature updated successfully"})
}

func DeleteFeatureHandler(c *gin.Context, db *gorm.DB) {
	featureID, err := strconv.Atoi(c.Param("featureId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid feature ID"})
		return
	}

	characterID := c.MustGet("character_id").(int)
	featureService := services.NewFeatureService(db)
	err = featureService.DeleteFeature(featureID, characterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Feature deleted successfully"})
}
