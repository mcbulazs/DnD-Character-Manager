package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/services"
	"DnDCharacterSheet/utility"
)

type UserController struct {
	Service        services.UserServiceInterface
	SessionManager utility.SessionManager
}

func NewUserController(db *gorm.DB, session utility.SessionManager) *UserController {
	repo := repositories.NewUserRepository(db)
	service := services.NewUserService(repo)
	return &UserController{
		Service:        service,
		SessionManager: session,
	}
}

func (u *UserController) GetUserDataHandler(c *gin.Context) {
	userID := u.SessionManager.GetUserIdBySession(c)
	user, err := u.Service.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (u *UserController) RegisterHandler(c *gin.Context) {
	var user dto.AuthUserDTO
	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Create the user using the service
	userModel, err := u.Service.CreateUser(&user)
	if err != nil {
		if err == gorm.ErrDuplicatedKey {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		return
	}
	err = u.SessionManager.CreateSession(c, int(userModel.ID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "User created"})
}

func (u *UserController) LoginHandler(c *gin.Context) {
	var user dto.AuthUserDTO
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	userID, err := u.Service.AuthenticateUser(&user)
	if err != nil {
		if err == services.ErrAuthenticationFailed {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication failed"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		return
	}

	err = u.SessionManager.CreateSession(c, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User authenticated"})
}

func (u *UserController) AuthHandler(c *gin.Context) {
	u.SessionManager.GetUserAuthentication(c)
}

func (u *UserController) LogoutHandler(c *gin.Context) {
	u.SessionManager.ClearSession(c)
}
