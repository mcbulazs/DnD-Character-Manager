package controllers

import (
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/services"
	"DnDCharacterSheet/utility"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	utility.CreateSession(c, int(user.ID))
	c.JSON(http.StatusCreated, gin.H{"message": "User created"})
}

func LoginHandler(c *gin.Context, db *gorm.DB) {
	var loginUser models.User
	err := c.BindJSON(&loginUser)
	fmt.Println("Login user:", loginUser)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Create the user using the service
	userService := services.NewUserService(db)
	user_id, err := userService.AuthenticateUser(loginUser.Email, loginUser.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	utility.CreateSession(c, user_id)

	c.JSON(http.StatusOK, gin.H{"message": "User authenticated"})
}

func LogoutHandler(c *gin.Context) {
	utility.ClearSession(c)
}
