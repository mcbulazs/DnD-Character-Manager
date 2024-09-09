package controllers

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/pelletier/go-toml/v2/internal/tracker"
	"gorm.io/gorm"

	"DnDCharacterSheet/middleware"
)

func InitControllers(r *gin.Engine, db *gorm.DB) {
	r.StaticFile("/robots.txt", "./files/robots.txt")

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
	auth.GET("/characters/:characterId", func(c *gin.Context) {
		GetCharacterHandler(c, db)
	})

	characters := auth.Group("/characters/:characterId", func(c *gin.Context) {
		middleware.CharacterMiddleware(c, db)
	})
	characters.DELETE("", func(c *gin.Context) {
		DeleteCharacterHandler(c, db)
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
	characters.PUT("/image", func(c *gin.Context) {
		UpdateCharacterImageHandler(c, db)
	})
	characters.PATCH("/attributes", func(c *gin.Context) {
		UpdateCharacterAttribute(c, db)
	})

	features := characters.Group("/features")
	features.GET("", func(c *gin.Context) {
		GetFeaturesHandler(c, db)
	})
	features.POST("", func(c *gin.Context) {
		CreateFeatureHandler(c, db)
	})
	features.PUT("/:featureId", func(c *gin.Context) {
		UpdateFeatureHandler(c, db)
	})
	features.DELETE("/:featureId", func(c *gin.Context) {
		DeleteFeatureHandler(c, db)
	})

	spells := characters.Group("/spells")
	spells.POST("", func(c *gin.Context) {
		CreateSpellHandler(c, db)
	})
	spells.PUT("/:spellId", func(c *gin.Context) {
		UpdateSpellHandler(c, db)
	})
	spells.DELETE("/:spellId", func(c *gin.Context) {
		DeleteSpellHandler(c, db)
	})

	tracker := characters.Group("/tracker")
	tracker.POST("", func(c *gin.Context) {
		CreateTrackerHandler(c, db)
	})
	tracker.PUT("/:trackerId", func(c *gin.Context) {
		UpdateTrackerHandler(c, db)
	})
	tracker.DELETE("/:trackerId", func(c *gin.Context) {
		DeleteTrackerHandler(c, db)
	})

	InitProxy(r)
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
