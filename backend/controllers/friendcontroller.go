package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/services"
	"DnDCharacterSheet/utility"
)

type FriendServiceInterface interface {
	SendFriendRequest(userID int, friend *dto.UserDataDTO) (error, *models.UserModel)
	AcceptFriendRequest(userID int, friendRequestId int) (error, *models.FriendRequestModel)
	DeclineFriendRequest(userID int, friendRequestId int) (error, *models.FriendRequestModel)
	Unfriend(userID int, friendId int) (error, *models.FriendsModel)
	ShareCharacter(userID int, friendId int, characterId int) (error, *models.FriendsModel)
	UnshareCharacter(userID int, friendId int, characterId int) (error, *models.FriendsModel)
	UpdateName(userID int, friendId int, name string) error
	IsUserFriend(userID int, friendId int) bool
	FindByUserIDAndFriendID(userID uint, friendID uint) ([]dto.CharacterBaseDTO, error)
}
type FriendController struct {
	Service        FriendServiceInterface
	SessionManager utility.SessionManager
}

func NewFriendController(db *gorm.DB, session utility.SessionManager) *FriendController {
	repo := repositories.NewFriendRepository(db)
	userRepo := repositories.NewUserRepository(db)
	service := services.NewFriendService(repo, userRepo)
	return &FriendController{
		Service:        service,
		SessionManager: session,
	}
}

func (co *FriendController) SendFriendRequestHandler(c *gin.Context) {
	var Friend dto.UserDataDTO
	err := c.BindJSON(&Friend)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	userId := c.MustGet("user_id").(int)
	err, user := co.Service.SendFriendRequest(userId, &Friend)
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

func (co *FriendController) AcceptFriendRequestHandler(c *gin.Context) {
	friendRequestId, err := strconv.Atoi(c.Param("friendRequestId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	userId := c.MustGet("user_id").(int)
	err, request := co.Service.AcceptFriendRequest(userId, friendRequestId)
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

func (co *FriendController) DeclineFriendRequestHandler(c *gin.Context) {
	friendRequestId, err := strconv.Atoi(c.Param("friendRequestId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	userId := c.MustGet("user_id").(int)
	err, request := co.Service.DeclineFriendRequest(userId, friendRequestId)
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

func (co *FriendController) UnfriendHandler(c *gin.Context) {
	friendId, err := strconv.Atoi(c.Param("friendId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	userId := c.MustGet("user_id").(int)
	err, friend := co.Service.Unfriend(userId, friendId)
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

func (co *FriendController) UpdateFriendNameHandler(c *gin.Context) {
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
	err = co.Service.UpdateName(userId, friendId, friend.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Friend name updated"})
}

func (co *FriendController) ShareCharacterHandler(c *gin.Context) {
	characterId, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	friendUserId := c.MustGet("friend_id").(uint)
	userId := c.MustGet("user_id").(int)

	err, friend := co.Service.ShareCharacter(userId, int(friendUserId), characterId)
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

func (co *FriendController) UnshareCharacterHandler(c *gin.Context) {
	characterId, err := strconv.Atoi(c.Param("characterId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		c.Abort()
		return
	}
	friendId := c.MustGet("friend_id").(uint)
	userId := c.MustGet("user_id").(int)
	err, friend := co.Service.UnshareCharacter(userId, int(friendId), characterId)
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

func (co *FriendController) GetSharedCharactersHandler(c *gin.Context) {
	friendID, err := strconv.Atoi(c.Param("friendId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid friend ID"})
		return
	}
	userID := c.MustGet("user_id").(int)
	characters, err := co.Service.FindByUserIDAndFriendID(uint(friendID), uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, characters)
}

func (co *FriendController) FriendMiddleware(c *gin.Context) {
	friendID, err := strconv.Atoi(c.Param("friendId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		c.Abort()
		return
	}

	c.Set("friend_id", uint(friendID))
	userId := c.MustGet("user_id").(int)
	isFriend := co.Service.IsUserFriend(userId, friendID)
	if !isFriend {
		c.JSON(http.StatusForbidden, gin.H{"error": "User is not the owner of the character"})
		c.Abort()
		return
	}
	c.Next()
}
