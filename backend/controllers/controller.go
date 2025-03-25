package controllers

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/middleware"
	"DnDCharacterSheet/websocket"
)

func InitControllers(r *gin.Engine, db *gorm.DB) {
	// websockets
	characterClientManager := websocket.NewClientManager()

	r.StaticFile("/robots.txt", "./files/robots.txt")
	r.StaticFile("/favicon.ico", "./files/favicon.ico")
	r.StaticFile("/sitemap.xml", "./files/sitemap.xml")

	api := r.Group("/api")
	initCors(api)

	// websocket
	ws := api.Group("/ws")

	ws.GET("/characters/:Id", func(c *gin.Context) {
		websocket.HandleWebSocket(c, characterClientManager)
	})

	api.OPTIONS("/*path", middleware.OptionsMidddleware)

	api.POST("/register", func(c *gin.Context) {
		RegisterHandler(c, db)
	})
	api.POST("/login", func(c *gin.Context) {
		LoginHandler(c, db)
	})
	api.GET("/auth", AuthHandler)

	auth := api.Group("/", middleware.AuthMiddleware())
	auth.GET("/user", func(c *gin.Context) {
		GetUserDataHandler(c, db)
	})
	auth.POST("/logout", LogoutHandler)

	friendRequests := auth.Group("/friendRequest")
	friendRequests.POST("", func(c *gin.Context) {
		SendFriendRequestHandler(c, db)
	})
	friendRequests.PATCH("/:friendRequestId/accept", func(c *gin.Context) {
		AcceptFriendRequestHandler(c, db)
	})
	friendRequests.PATCH("/:friendRequestId/decline", func(c *gin.Context) {
		DeclineFriendRequestHandler(c, db)
	})

	friends := auth.Group("/friends/:friendId")
	friends.DELETE("", func(c *gin.Context) {
		UnfriendHandler(c, db)
	})
	friendsCharacter := friends.Group("/share",
		func(c *gin.Context) {
			middleware.FriendMiddleware(c, db)
		},
	)

	// friend to share with
	friendsCharacter.POST("/:characterId",
		func(c *gin.Context) {
			middleware.CharacterMiddleware(c, db)
		},
		func(c *gin.Context) {
			ShareCharacterHandler(c, db)
		})
	friendsCharacter.DELETE("/:characterId",
		func(c *gin.Context) {
			middleware.CharacterMiddleware(c, db)
		},
		func(c *gin.Context) {
			UnshareCharacterHandler(c, db)
		})
	// friend who shared with me
	friendsCharacter.GET("", func(c *gin.Context) {
		GetSharedCharactersHandler(c, db)
	})

	auth.POST("/characters", func(c *gin.Context) {
		CreateCharacterHandler(c, db)
	})
	auth.GET("/characters/:characterId", func(c *gin.Context) {
		GetCharacterHandler(c, db)
	})

	characters := auth.Group("/characters/:characterId", func(c *gin.Context) {
		middleware.CharacterMiddleware(c, db)
		middleware.AfterRequestMiddleware(c, characterClientManager)
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

	tracker := characters.Group("/trackers")
	tracker.POST("", func(c *gin.Context) {
		CreateTrackerHandler(c, db)
	})
	tracker.PUT("/:trackerId", func(c *gin.Context) {
		UpdateTrackerHandler(c, db)
	})
	tracker.PATCH("/order", func(c *gin.Context) {
		UpdateTrackerOrderHandler(c, db)
	})
	tracker.DELETE("/:trackerId", func(c *gin.Context) {
		DeleteTrackerHandler(c, db)
	})

	noteCategories := characters.Group("/notes")
	noteCategories.POST("", func(c *gin.Context) {
		CreateNoteCategoryHandler(c, db)
	})
	noteCategories.PUT("/:categoryId", func(c *gin.Context) {
		UpdateNoteCategoryHandler(c, db)
	})
	noteCategories.DELETE("/:categoryId", func(c *gin.Context) {
		DeleteNoteCategoryHandler(c, db)
	})

	note := noteCategories.Group("/:categoryId", func(c *gin.Context) {
		middleware.NoteMiddleware(c, db)
	})
	note.POST("", func(c *gin.Context) {
		CreateNoteHandler(c, db)
	})
	note.PUT("/:noteId", func(c *gin.Context) {
		UpdateNoteHandler(c, db)
	})
	note.DELETE("/:noteId", func(c *gin.Context) {
		DeleteNoteHandler(c, db)
	})

	api.GET("/test", func(c *gin.Context) {
	})

	InitProxy(r)
}

func initCors(r *gin.RouterGroup) {
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://192.168.0.92:5173", "http://192.168.0.92:8080", "https://dnd.bulazs.com"}, // Allow your dev origin
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}
	r.Use(cors.New(corsConfig))
}
