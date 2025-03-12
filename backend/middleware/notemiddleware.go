package middleware

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/services"
)

func NoteMiddleware(c *gin.Context, db *gorm.DB) {
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

	c.Set("character_id", characterID)
	c.Set("category_id", categoryID)
	noteService := services.NewNoteService(db)
	isOwner := noteService.IsNoteCategoryCharacters(characterID, categoryID)
	if !isOwner {
		c.JSON(http.StatusForbidden, gin.H{"error": "Note category does not belong to character"})
		c.Abort()
		return
	}
	c.Next()
}
