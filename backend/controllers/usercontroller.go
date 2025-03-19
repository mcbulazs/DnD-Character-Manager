package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/services"
	"DnDCharacterSheet/utility"
)

func RegisterHandler(c *gin.Context, db *gorm.DB) {
	var user dto.CreateUserDTO
	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Create the user using the service
	userService := services.NewUserService(db) // Initialize UserService with DB
	userModel, err := userService.CreateUser(&user)
	if err != nil {
		if err == services.ErrUserExists {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		return
	}
	err = utility.CreateSession(c, int(userModel.ID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "User created"})
}

func LoginHandler(c *gin.Context, db *gorm.DB) {
	var user dto.CreateUserDTO
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	userService := services.NewUserService(db) // Initialize UserService with DB
	userID, err := userService.AuthenticateUser(&user)
	if err != nil {
		if err == services.ErrAuthenticationFailed {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication failed"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		return
	}

	err = utility.CreateSession(c, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User authenticated"})
}

func SendFriendRequestHandler(c *gin.Context, db *gorm.DB) {
	var Friend dto.UserDTO
	err := c.BindJSON(&Friend)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userId := c.MustGet("user_id").(int)
	userService := services.NewUserService(db) // Initialize UserService with DB
	err = userService.SendFriendRequest(userId, Friend.Email)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Friend request already exists"})
		return
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
	userService := services.NewUserService(db) // Initialize UserService with DB
	err = userService.AcceptFriendRequest(userId, friendRequestId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
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
	userService := services.NewUserService(db) // Initialize UserService with DB
	err = userService.DeclineFriendRequest(userId, friendRequestId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Friend request declined"})
}

func AuthHandler(c *gin.Context) {
	utility.SetUserAuthentication(c)
}

func LogoutHandler(c *gin.Context) {
	utility.ClearSession(c)
}
