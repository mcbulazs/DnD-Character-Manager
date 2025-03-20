package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/services"
	"DnDCharacterSheet/utility"
)

func GetUserDataHandler(c *gin.Context, db *gorm.DB) {
	userID := c.MustGet("user_id").(int)
	userService := services.NewUserService(db)
	user, err := userService.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func RegisterHandler(c *gin.Context, db *gorm.DB) {
	var user dto.AuthUserDTO
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
	var user dto.AuthUserDTO
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

func AuthHandler(c *gin.Context) {
	utility.SetUserAuthentication(c)
}

func LogoutHandler(c *gin.Context) {
	utility.ClearSession(c)
}
