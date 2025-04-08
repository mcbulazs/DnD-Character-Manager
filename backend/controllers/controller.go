package controllers

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/env"
	"DnDCharacterSheet/middleware"
	"DnDCharacterSheet/websocket"
)

func InitControllers(r *gin.Engine, db *gorm.DB) {
	r.StaticFile("/robots.txt", "./files/robots.txt")
	r.StaticFile("/favicon.ico", "./files/favicon.ico")
	r.StaticFile("/sitemap.xml", "./files/sitemap.xml")

	api := r.Group("/api")
	initCors(api)

	api.OPTIONS("/*path", middleware.OptionsMidddleware)

	api.POST("/register", Handler(RegisterHandler, db))
	api.POST("/login", Handler(LoginHandler, db))
	api.GET("/auth", AuthHandler)

	auth := api.Group("/", middleware.AuthMiddleware())
	auth.GET("/user", Handler(GetUserDataHandler, db))
	auth.POST("/logout", LogoutHandler)

	// websocket
	auth.GET("/ws/*Id", websocket.HandleWebSocket)

	friendRequests := auth.Group("/friendRequest")
	friendRequests.POST("",
		Handler(SendFriendRequestHandler, db),
		middleware.UserWebsocketMiddleware,
	)
	friendRequests.PATCH("/:friendRequestId/accept",
		Handler(AcceptFriendRequestHandler, db),
		middleware.UserWebsocketMiddleware,
	)
	friendRequests.PATCH("/:friendRequestId/decline",
		Handler(DeclineFriendRequestHandler, db),
		middleware.UserWebsocketMiddleware,
	)

	friends := auth.Group("/friends/:friendId")
	friends.DELETE("",
		Handler(UnfriendHandler, db),
		middleware.UserWebsocketMiddleware,
	)
	friends.PATCH("/name", Handler(UpdateFriendNameHandler, db))
	friendsCharacter := friends.Group("/share",
		Handler(middleware.FriendMiddleware, db),
		middleware.UserWebsocketMiddleware,
	)

	// friend to share with
	friendsCharacter.POST("/:characterId",
		Handler(middleware.CharacterMiddleware, db),
		Handler(ShareCharacterHandler, db),
	)
	friendsCharacter.DELETE("/:characterId",
		Handler(middleware.CharacterMiddleware, db),
		Handler(UnshareCharacterHandler, db),
	)
	// friend who shared with me
	friendsCharacter.GET("", Handler(GetSharedCharactersHandler, db))

	auth.POST("/characters", Handler(CreateCharacterHandler, db))
	auth.GET("/characters/:characterId", Handler(GetCharacterHandler, db))

	characters := auth.Group("/characters/:characterId",
		Handler(middleware.CharacterMiddleware, db),
		middleware.CharacterWebsocketMiddleware,
	)

	characters.DELETE("", Handler(DeleteCharacterHandler, db))
	characters.PUT("/ability-scores", Handler(UpdateCharacterAbilityScoresHandler, db))
	characters.PUT("/skills", Handler(UpdateCharacterSkillsHandler, db))
	characters.PUT("/saving-throws", Handler(UpdateCharacterSavingThrowsHandler, db))
	characters.PUT("/image", Handler(UpdateCharacterImageHandler, db))
	characters.PATCH("/attributes", Handler(UpdateCharacterAttribute, db))
	characters.PUT("/options", Handler(UpdateCharacterOptionsHandler, db))

	features := characters.Group("/features")
	features.POST("", Handler(CreateFeatureHandler, db))
	features.PUT("/:featureId", Handler(UpdateFeatureHandler, db))
	features.DELETE("/:featureId", Handler(DeleteFeatureHandler, db))

	spells := characters.Group("/spells")
	spells.POST("", Handler(CreateSpellHandler, db))
	spells.PUT("/:spellId", Handler(UpdateSpellHandler, db))
	spells.DELETE("/:spellId", Handler(DeleteSpellHandler, db))

	tracker := characters.Group("/trackers")
	tracker.POST("", Handler(CreateTrackerHandler, db))
	tracker.PUT("/:trackerId", Handler(UpdateTrackerHandler, db))
	tracker.PATCH("/order", Handler(UpdateTrackerOrderHandler, db))
	tracker.DELETE("/:trackerId", Handler(DeleteTrackerHandler, db))

	noteCategories := characters.Group("/notes")
	noteCategories.POST("", Handler(CreateNoteCategoryHandler, db))
	noteCategories.PUT("/:categoryId", Handler(UpdateNoteCategoryHandler, db))
	noteCategories.DELETE("/:categoryId", Handler(DeleteNoteCategoryHandler, db))

	note := noteCategories.Group("/:categoryId", Handler(middleware.NoteMiddleware, db))
	note.POST("", Handler(CreateNoteHandler, db))
	note.PUT("/:noteId", Handler(UpdateNoteHandler, db))
	note.DELETE("/:noteId", Handler(DeleteNoteHandler, db))

	InitProxy(r)
}

func Handler[T any](fn func(*gin.Context, T), arg T) gin.HandlerFunc {
	return func(c *gin.Context) {
		fn(c, arg)
	}
}

func initCors(r *gin.RouterGroup) {
	corsConfig := cors.Config{
		AllowOrigins:     env.AllowedOrigins(),
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}
	r.Use(cors.New(corsConfig))
}
