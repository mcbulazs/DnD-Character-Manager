package controllers

import (
	"DnDCharacterSheet/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InitControllers(r *gin.Engine, db *gorm.DB) {
	r.POST("/register", func(c *gin.Context) {
		RegisterHandler(c, db)
	})
	r.POST("/login", func(c *gin.Context) {
		LoginHandler(c, db)
	})

	api := r.Group("/", middleware.AuthMiddleware())
	api.POST("/logout", LogoutHandler)

}
