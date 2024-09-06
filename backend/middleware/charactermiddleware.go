package middleware

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/services"
)

func CharacterMiddleware(c *gin.Context, db *gorm.DB) {
	characterID, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		c.Abort()
		return
	}

	c.Set("character_id", characterID)
	userId := c.MustGet("user_id").(int)
	characterService := services.NewCharacterService(db)
	isOwner := characterService.IsUserCharacter(userId, characterID)
	if !isOwner {
		c.JSON(http.StatusForbidden, gin.H{"error": "User is not the owner of the character"})
		c.Abort()
		return
	}
	c.Next()
}
