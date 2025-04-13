package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/services"
)

func SendFriendRequestHandler(c *gin.Context, db *gorm.DB) {
	var Friend dto.UserDataDTO
	err := c.BindJSON(&Friend)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	userId := c.MustGet("user_id").(int)
	FriendService := services.NewFriendService(db) // Initialize UserService with DB
	err, user := FriendService.SendFriendRequest(userId, &Friend)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			c.Abort()
			return
		}
		if err == gorm.ErrCheckConstraintViolated {
			c.JSON(http.StatusConflict, gin.H{"error": "Friend request already exists"})
			c.Abort()
			return
		}
	}
	c.Set("friend_id", Friend.ID)
	websocketMessage := fmt.Sprintf("You have got a friend request from %s", user.Email)
	c.Set("websocket_message", websocketMessage)
	c.JSON(http.StatusOK, gin.H{"message": "Friend request sent"})
}

func AcceptFriendRequestHandler(c *gin.Context, db *gorm.DB) {
	friendRequestId, err := strconv.Atoi(c.Param("friendRequestId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	userId := c.MustGet("user_id").(int)
	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err, request := friendService.AcceptFriendRequest(userId, friendRequestId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		c.Abort()
		return
	}
	c.Set("friend_id", request.SourceUserID)
	websocketMessage := fmt.Sprintf("%s accepted your friend request", request.SourceUser.Email)
	c.Set("websocket_message", websocketMessage)
	c.JSON(http.StatusOK, gin.H{"message": "Friend request accepted"})
}

func DeclineFriendRequestHandler(c *gin.Context, db *gorm.DB) {
	friendRequestId, err := strconv.Atoi(c.Param("friendRequestId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	userId := c.MustGet("user_id").(int)
	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err, request := friendService.DeclineFriendRequest(userId, friendRequestId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		c.Abort()
		return
	}
	c.Set("friend_id", request.SourceUserID)
	websocketMessage := fmt.Sprintf("%s declined your friend request", request.SourceUser.Email)
	c.Set("websocket_message", websocketMessage)
	c.JSON(http.StatusOK, gin.H{"message": "Friend request declined"})
}

func UnfriendHandler(c *gin.Context, db *gorm.DB) {
	friendId, err := strconv.Atoi(c.Param("friendId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	userId := c.MustGet("user_id").(int)
	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err, friend := friendService.Unfriend(userId, friendId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		c.Abort()
		return
	}
	friendName := friend.Friend.Email
	if friend.Name != "" {
		friendName = friend.Name
	}
	c.Set("friend_id", uint(friendId))
	websocketMessage := fmt.Sprintf("%s and you are no longer friends", friendName)
	c.Set("websocket_message", websocketMessage)
	c.JSON(http.StatusOK, gin.H{"message": "Friend removed"})
}

func UpdateFriendNameHandler(c *gin.Context, db *gorm.DB) {
	var friend dto.FriendDTO
	if err := c.BindJSON(&friend); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		c.Abort()
		return
	}
	friendId, err := strconv.Atoi(c.Param("friendId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	userId := c.MustGet("user_id").(int)
	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err = friendService.UpdateName(userId, friendId, friend.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Friend name updated"})
}

func ShareCharacterHandler(c *gin.Context, db *gorm.DB) {
	characterId, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	friendUserId := c.MustGet("friend_id").(uint)
	userId := c.MustGet("user_id").(int)

	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err, friend := friendService.ShareCharacter(userId, int(friendUserId), characterId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		c.Abort()
		return
	}
	friendName := friend.Friend.Email
	if friend.Name != "" {
		friendName = friend.Name
	}
	websocketMessage := fmt.Sprintf("%s shared a character with you", friendName)
	c.Set("websocket_message", websocketMessage)
	c.JSON(http.StatusOK, gin.H{"message": "Character shared"})
}

func UnshareCharacterHandler(c *gin.Context, db *gorm.DB) {
	characterId, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	friendId := c.MustGet("friend_id").(uint)
	userId := c.MustGet("user_id").(int)
	friendService := services.NewFriendService(db) // Initialize UserService with DB
	err, friend := friendService.UnshareCharacter(userId, int(friendId), characterId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		c.Abort()
		return
	}
	friendName := friend.Friend.Email
	if friend.Name != "" {
		friendName = friend.Name
	}
	websocketMessage := fmt.Sprintf("%s unshared a character with you", friendName)
	c.Set("websocket_message", websocketMessage)
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
