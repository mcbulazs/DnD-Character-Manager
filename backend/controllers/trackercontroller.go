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

type TrackerServiceInterface interface {
	CreateTracker(characterID int, trackerDTO *dto.CreateCharacterTrackerDTO) (*dto.CharacterTrackerDTO, error)
	UpdateTracker(characterID int, trackerDTO *dto.CharacterTrackerDTO) error
	UpdateTrackerOrder(characterID int, trackerOrderDTO *[]int) error
	DeleteTracker(characterID int, trackerID int) error
}

type TrackerController struct {
	Service        TrackerServiceInterface
	SessionManager utility.SessionManager
}

func NewTrackerController(db *gorm.DB, session utility.SessionManager) *TrackerController {
	repo := repositories.NewTrackerRepository(db)
	service := services.NewTrackerService(repo)
	return &TrackerController{
		Service:        service,
		SessionManager: session,
	}
}

func (co *TrackerController) CreateTrackerHandler(c *gin.Context) {
	characterID := c.MustGet("character_id").(int)
	var createTrackerDTO dto.CreateCharacterTrackerDTO
	if err := c.ShouldBindJSON(&createTrackerDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	trackerDTO, err := co.Service.CreateTracker(characterID, &createTrackerDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, trackerDTO)
}

func (co *TrackerController) UpdateTrackerHandler(c *gin.Context) {
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

	err = co.Service.UpdateTracker(characterID, &trackerDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func (co *TrackerController) UpdateTrackerOrderHandler(c *gin.Context) {
	var trackerOrderDTO []int
	if err := c.ShouldBindJSON(&trackerOrderDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	characterID := c.MustGet("character_id").(int)
	err := co.Service.UpdateTrackerOrder(characterID, &trackerOrderDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func (co *TrackerController) DeleteTrackerHandler(c *gin.Context) {
	trackerID, err := strconv.Atoi(c.Param("trackerId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tracker ID"})
		return
	}
	characterID := c.MustGet("character_id").(int)

	err = co.Service.DeleteTracker(characterID, trackerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}
