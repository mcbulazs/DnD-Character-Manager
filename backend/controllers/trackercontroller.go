package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/services"
)

func CreateTrackerHandler(c *gin.Context, db *gorm.DB) {
	characterID := c.MustGet("character_id").(int)
	var createTrackerDTO dto.CreateCharacterTrackerDTO
	if err := c.ShouldBindJSON(&createTrackerDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	trackerService := services.NewTrackerService(db)
	trackerDTO, err := trackerService.CreateTracker(characterID, &createTrackerDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, trackerDTO)
}

func UpdateTrackerHandler(c *gin.Context, db *gorm.DB) {
	var trackerDTO dto.CharacterTrackerDTO
	if err := c.ShouldBindJSON(&trackerDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	trackerID, err := strconv.Atoi(c.Param("trackerId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tracker ID"})
		return
	}
	trackerDTO.ID = uint(trackerID)
	characterID := c.MustGet("character_id").(int)

	trackerService := services.NewTrackerService(db)
	err = trackerService.UpdateTracker(characterID, &trackerDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func UpdateTrackerOrderHandler(c *gin.Context, db *gorm.DB) {
	var trackerOrderDTO []int
	if err := c.ShouldBindJSON(&trackerOrderDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	characterID := c.MustGet("character_id").(int)
	trackerService := services.NewTrackerService(db)
	err := trackerService.UpdateTrackerOrder(characterID, &trackerOrderDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func DeleteTrackerHandler(c *gin.Context, db *gorm.DB) {
	trackerID, err := strconv.Atoi(c.Param("trackerId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tracker ID"})
		return
	}
	characterID := c.MustGet("character_id").(int)

	trackerService := services.NewTrackerService(db)
	err = trackerService.DeleteTracker(characterID, trackerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}
