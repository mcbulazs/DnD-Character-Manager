package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/services"
)

func SendFriendRequestHandler(c *gin.Context, db *gorm.DB) {
	var Friend dto.UserDataDTO
	err := c.BindJSON(&Friend)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userId := c.MustGet("user_id").(int)
	FriendService := services.NewFriendService(db) // Initialize UserService with DB
	err = FriendService.SendFriendRequest(userId, Friend.Email)
	if err != nil {
		if err == repositories.ErrUserNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		if err == gorm.ErrCheckConstraintViolated {
			c.JSON(http.StatusConflict, gin.H{"error": "Friend request already exists"})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"message": "Friend request sent"})
}

func AcceptFriendRequestHandler(c *gin.Context, db *gorm.DB) {
	friendRequestId, err := strconv.Atoi(c.Param("friendRequestId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	userId := c.MustGet("user_id").(int)
	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err = friendService.AcceptFriendRequest(userId, friendRequestId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Friend request accepted"})
}

func DeclineFriendRequestHandler(c *gin.Context, db *gorm.DB) {
	friendRequestId, err := strconv.Atoi(c.Param("friendRequestId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	userId := c.MustGet("user_id").(int)
	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err = friendService.DeclineFriendRequest(userId, friendRequestId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Friend request declined"})
}

func UnfriendHandler(c *gin.Context, db *gorm.DB) {
	friendId, err := strconv.Atoi(c.Param("friendId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	userId := c.MustGet("user_id").(int)
	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err = friendService.Unfriend(userId, friendId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Friend removed"})
}

func ShareCharacterHandler(c *gin.Context, db *gorm.DB) {
	characterId, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	friendUserId := c.MustGet("friend_id").(int)

	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err = friendService.ShareCharacter(friendUserId, characterId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Character shared"})
}

func UnshareCharacterHandler(c *gin.Context, db *gorm.DB) {
	characterId, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	friendUserId := c.MustGet("user_id").(int)
	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err = friendService.UnshareCharacter(friendUserId, characterId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Character unshared"})
}

func GetSharedCharactersHandler(c *gin.Context, db *gorm.DB) {
	friendID, err := strconv.Atoi(c.Param("friendId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid friend ID"})
		return
	}
	userID := c.MustGet("user_id").(int)
	service := services.NewFriendService(db)
	characters, err := service.FindByUserIDAndFriendID(uint(friendID), uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, characters)
}
