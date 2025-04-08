package middleware

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/services"
)

func FriendMiddleware(c *gin.Context, db *gorm.DB) {
	friendID, err := strconv.Atoi(c.Param("friendId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		c.Abort()
		return
	}

	c.Set("friend_id", uint(friendID))
	userId := c.MustGet("user_id").(int)
	friendService := services.NewFriendService(db)
	isFriend := friendService.IsUserFriend(userId, friendID)
	if !isFriend {
		c.JSON(http.StatusForbidden, gin.H{"error": "User is not the owner of the character"})
		c.Abort()
		return
	}
	c.Next()
}
