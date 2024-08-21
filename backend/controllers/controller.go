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
		AllowOrigins:     []string{"http://localhost:5173", "http://192.168.0.101:5173", "http://localhost:4200", "http://192.168.0.101:4200"}, // Allow your frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}
	r.Use(cors.New(corsConfig))
}
