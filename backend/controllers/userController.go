package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
	"DnDCharacterSheet/services"
	"DnDCharacterSheet/utility"
)

func RegisterHandler(c *gin.Context, db *gorm.DB) {
	var user models.User
	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create the user using the service
	userService := services.NewUserService(db)
	err = userService.CreateUser(&user)
	if err != nil {
		if err == services.ErrUserExists {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		return
	}

	err = utility.CreateSession(c, int(user.ID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "User created"})
}

func LoginHandler(c *gin.Context, db *gorm.DB) {
	var loginUser models.User
	if err := c.BindJSON(&loginUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	userService := services.NewUserService(db)
	userID, err := userService.AuthenticateUser(loginUser.Email, loginUser.Password)
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
