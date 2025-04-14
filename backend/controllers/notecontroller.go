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

type NoteServiceInterface interface {
	IsNoteCategoryCharacters(characterID int, categoryID int) bool
	CreateNoteCategory(characterID int, noteCategoryDTO *dto.CharacterCreateNoteCategoryDTO) (*dto.CharacterNoteCategoryDTO, error)
	UpdateNoteCategory(characterID int, noteCategoryDTO *dto.CharacterNoteCategoryDTO) error
	DeleteNoteCategory(noteCategoryID int, characterID int) error
	CreateNote(categoryID int) (*dto.CharacterNoteDTO, error)
	UpdateNote(categoryID int, noteDTO *dto.CharacterNoteDTO) error
	DeleteNote(categoryID int, noteID int) error
}

type NoteController struct {
	Service        NoteServiceInterface
	SessionManager utility.SessionManager
}

func NewNoteController(db *gorm.DB, session utility.SessionManager) *NoteController {
	repo := repositories.NewNoteRepository(db)
	service := services.NewNoteService(repo)
	return &NoteController{
		Service:        service,
		SessionManager: session,
	}
}

func (co *NoteController) CreateNoteCategoryHandler(c *gin.Context) {
	var createNoteCategoryDTO dto.CharacterCreateNoteCategoryDTO
	if err := c.ShouldBindJSON(&createNoteCategoryDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	characterID := c.MustGet("character_id").(int)
	noteCategoryDTO, err := co.Service.CreateNoteCategory(characterID, &createNoteCategoryDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, noteCategoryDTO)
}

func (co *NoteController) UpdateNoteCategoryHandler(c *gin.Context) {
	categoryId, err := strconv.Atoi(c.Param("categoryId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note category ID"})
		return
	}
	var noteCategoryDTO dto.CharacterNoteCategoryDTO
	if err := c.ShouldBindJSON(&noteCategoryDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	noteCategoryDTO.ID = uint(categoryId)
	characterID := c.MustGet("character_id").(int)
	err = co.Service.UpdateNoteCategory(characterID, &noteCategoryDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Note category updated successfully"})
}

func (co *NoteController) DeleteNoteCategoryHandler(c *gin.Context) {
	categoryID, err := strconv.Atoi(c.Param("categoryId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note category ID"})
		return
	}
	characterId := c.MustGet("character_id").(int)
	err = co.Service.DeleteNoteCategory(categoryID, characterId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Note category deleted successfully"})
}

func (co *NoteController) CreateNoteHandler(c *gin.Context) {
	categoryID := c.MustGet("category_id").(int)
	noteDTO, err := co.Service.CreateNote(categoryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, noteDTO)
}

func (co *NoteController) UpdateNoteHandler(c *gin.Context) {
	var noteDTO dto.CharacterNoteDTO
	if err := c.ShouldBindJSON(&noteDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	categoryID := c.MustGet("category_id").(int)
	err := co.Service.UpdateNote(categoryID, &noteDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Note updated successfully"})
}

func (co *NoteController) DeleteNoteHandler(c *gin.Context) {
	noteID, err := strconv.Atoi(c.Param("noteId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note ID"})
		return
	}
	categoryID := c.MustGet("category_id").(int)
	err = co.Service.DeleteNote(categoryID, noteID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Note deleted successfully"})
}

func (co *NoteController) NoteMiddleware(c *gin.Context) {
	characterID, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		c.Abort()
		return
	}
	categoryID, err := strconv.Atoi(c.Param("categoryId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note category ID"})
		c.Abort()
		return
	}

	c.Set("category_id", categoryID)
	isOwner := co.Service.IsNoteCategoryCharacters(characterID, categoryID)
	if !isOwner {
		c.JSON(http.StatusForbidden, gin.H{"error": "Note category does not belong to character"})
		c.Abort()
		return
	}
	c.Next()
}
