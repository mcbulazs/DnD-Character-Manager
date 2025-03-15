package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/services"
)

func CreateNoteCategoryHandler(c *gin.Context, db *gorm.DB) {
	var createNoteCategoryDTO dto.CharacterCreateNoteCategoryDTO
	if err := c.ShouldBindJSON(&createNoteCategoryDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	characterID := c.MustGet("character_id").(int)
	noteService := services.NewNoteService(db)
	noteCategoryDTO, err := noteService.CreateNoteCategory(characterID, &createNoteCategoryDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, noteCategoryDTO)
}

func UpdateNoteCategoryHandler(c *gin.Context, db *gorm.DB) {
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
	noteService := services.NewNoteService(db)
	err = noteService.UpdateNoteCategory(characterID, &noteCategoryDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Note category updated successfully"})
}

func DeleteNoteCategoryHandler(c *gin.Context, db *gorm.DB) {
	categoryID, err := strconv.Atoi(c.Param("categoryId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note category ID"})
		return
	}
	characterId := c.MustGet("character_id").(int)
	noteService := services.NewNoteService(db)
	err = noteService.DeleteNoteCategory(categoryID, characterId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Note category deleted successfully"})
}

func CreateNoteHandler(c *gin.Context, db *gorm.DB) {
	categoryID := c.MustGet("category_id").(int)
	noteService := services.NewNoteService(db)
	noteDTO, err := noteService.CreateNote(categoryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, noteDTO)
}

func UpdateNoteHandler(c *gin.Context, db *gorm.DB) {
	var noteDTO dto.CharacterNoteDTO
	if err := c.ShouldBindJSON(&noteDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	categoryID := c.MustGet("category_id").(int)
	noteService := services.NewNoteService(db)
	err := noteService.UpdateNote(categoryID, &noteDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Note updated successfully"})
}

func DeleteNoteHandler(c *gin.Context, db *gorm.DB) {
	noteID, err := strconv.Atoi(c.Param("noteId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note ID"})
		return
	}
	categoryID := c.MustGet("category_id").(int)
	noteService := services.NewNoteService(db)
	err = noteService.DeleteNote(categoryID, noteID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Note deleted successfully"})
}
