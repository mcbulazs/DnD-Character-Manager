package controllers

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/middleware"
)

func InitControllers(r *gin.Engine, db *gorm.DB) {
	initCors(r)

	r.POST("/register", func(c *gin.Context) {
		RegisterHandler(c, db)
	})
	r.POST("/login", func(c *gin.Context) {
		LoginHandler(c, db)
	})

	api := r.Group("/", middleware.AuthMiddleware())
	api.POST("/logout", LogoutHandler)
	api.POST("/characters", func(c *gin.Context) {
		CreateCharacterHandler(c, db)
	})
	api.GET("/characters", func(c *gin.Context) {
		GetCharactersHandler(c, db)
	})
	api.POST("/characters/favorite/:id", func(c *gin.Context) {
		SetCharacterFavoriteHandler(c, db)
	})

}

func initCors(r *gin.Engine) {
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://192.168.0.101:5173", "https://887a-2a02-ab88-7512-a700-cc7b-76e6-5229-38d5.ngrok-free.app"}, // Allow your frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}
	r.Use(cors.New(corsConfig))
}
