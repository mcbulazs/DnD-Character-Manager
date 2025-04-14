package controllers

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"DnDCharacterSheet/env"
	"DnDCharacterSheet/middleware"
	"DnDCharacterSheet/utility"
	"DnDCharacterSheet/websocket"
)

func InitControllers(r *gin.Engine, db *gorm.DB) {
	session := utility.NewGorillaSessionManager()
	userController := NewUserController(db, session)
	characterController := NewCharacterController(db, session)

	r.StaticFile("/robots.txt", "./files/robots.txt")
	r.StaticFile("/favicon.ico", "./files/favicon.ico")
	r.StaticFile("/sitemap.xml", "./files/sitemap.xml")

	api := r.Group("/api")
	initCors(api)

	api.OPTIONS("/*path", middleware.OptionsMidddleware)

	api.POST("/register", userController.RegisterHandler)
	api.POST("/login", userController.LoginHandler)
	api.GET("/auth", userController.AuthHandler)

	auth := api.Group("/", middleware.AuthMiddleware(session))
	auth.GET("/user", userController.GetUserDataHandler)
	auth.POST("/logout", userController.LogoutHandler)

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
		characterController.CharacterMiddleware,
		Handler(ShareCharacterHandler, db),
	)
	friendsCharacter.DELETE("/:characterId",
		characterController.CharacterMiddleware,
		Handler(UnshareCharacterHandler, db),
	)
	// friend who shared with me
	friendsCharacter.GET("", Handler(GetSharedCharactersHandler, db))

	auth.POST("/characters", characterController.CreateCharacterHandler)
	auth.GET("/characters/:characterId", characterController.GetCharacterHandler)

	characters := auth.Group("/characters/:characterId",
		characterController.CharacterMiddleware,
		middleware.CharacterWebsocketMiddleware,
	)

	characters.DELETE("", characterController.DeleteCharacterHandler)
	characters.PUT("/ability-scores", characterController.UpdateCharacterAbilityScoresHandler)
	characters.PUT("/skills", characterController.UpdateCharacterSkillsHandler)
	characters.PUT("/saving-throws", characterController.UpdateCharacterSavingThrowsHandler)
	characters.PUT("/image", characterController.UpdateCharacterImageHandler)
	characters.PATCH("/attributes", characterController.UpdateCharacterAttribute)
	characters.PUT("/options", characterController.UpdateCharacterOptionsHandler)

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
