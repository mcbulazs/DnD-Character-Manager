package controllers

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/middleware"
)

func InitControllers(r *gin.Engine, db *gorm.DB) {
	// Serve static files from the "static" directory
	r.Static("/files", "./files")
	r.LoadHTMLFiles("files/index.html")

	// Define a route for the root path
	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})
	api := r.Group("/api")
	initCors(api)
	api.OPTIONS("/*path", middleware.OptionsMidddleware)

	api.POST("/register", func(c *gin.Context) {
		RegisterHandler(c, db)
	})
	api.POST("/login", func(c *gin.Context) {
		LoginHandler(c, db)
	})
	api.GET("/auth", AuthHandler)

	auth := api.Group("/", middleware.AuthMiddleware())
	auth.POST("/logout", LogoutHandler)
	auth.POST("/characters", func(c *gin.Context) {
		CreateCharacterHandler(c, db)
	})
	auth.GET("/characters", func(c *gin.Context) {
		GetCharactersHandler(c, db)
	})
	auth.GET("/characters/:id", func(c *gin.Context) {
		GetCharacterHandler(c, db)
	})
	auth.PUT("/characters/:id", func(c *gin.Context) {
		UpdateCharacterHandler(c, db)
	})
	auth.PATCH("/characters/favorite/:id", func(c *gin.Context) {
		SetCharacterFavoriteHandler(c, db)
	})

	characters := auth.Group("/characters/:id", func(c *gin.Context) {
		middleware.CharacterMiddleware(c, db)
	})
	characters.PUT("/ability-scores", func(c *gin.Context) {
		UpdateCharacterAbilityScoresHandler(c, db)
	})
	characters.PUT("/skills", func(c *gin.Context) {
		UpdateCharacterSkillsHandler(c, db)
	})
	characters.PUT("/saving-throws", func(c *gin.Context) {
		UpdateCharacterSavingThrowsHandler(c, db)
	})

	// frontend routes
	r.NoRoute(func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})
}

func initCors(r *gin.RouterGroup) {
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://192.168.0.101:5173"}, // Allow your dev origin
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}
	r.Use(cors.New(corsConfig))
}
