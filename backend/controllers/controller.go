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
	featureController := NewFeatureController(db, session)
	noteController := NewNoteController(db, session)
	spellController := NewSpellController(db, session)
	trackerController := NewTrackerController(db, session)
	friendController := NewFriendController(db, session)

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
		friendController.SendFriendRequestHandler,
		middleware.UserWebsocketMiddleware,
	)
	friendRequests.PATCH("/:friendRequestId/accept",
		friendController.AcceptFriendRequestHandler,
		middleware.UserWebsocketMiddleware,
	)
	friendRequests.PATCH("/:friendRequestId/decline",
		friendController.DeclineFriendRequestHandler,
		middleware.UserWebsocketMiddleware,
	)

	friends := auth.Group("/friends/:friendId")
	friends.DELETE("",
		friendController.UnfriendHandler,
		middleware.UserWebsocketMiddleware,
	)
	friends.PATCH("/name", friendController.UpdateFriendNameHandler)
	friendsCharacter := friends.Group("/share",
		friendController.FriendMiddleware,
		middleware.UserWebsocketMiddleware,
	)

	// friend to share with
	friendsCharacter.POST("/:characterId",
		characterController.CharacterMiddleware,
		friendController.ShareCharacterHandler,
	)
	friendsCharacter.DELETE("/:characterId",
		characterController.CharacterMiddleware,
		friendController.UnshareCharacterHandler,
	)
	// friend who shared with me
	friendsCharacter.GET("", friendController.GetSharedCharactersHandler)

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
	features.POST("", featureController.CreateFeatureHandler)
	features.PUT("/:featureId", featureController.UpdateFeatureHandler)
	features.DELETE("/:featureId", featureController.DeleteFeatureHandler)

	spells := characters.Group("/spells")
	spells.POST("", spellController.CreateSpellHandler)
	spells.PUT("/:spellId", spellController.UpdateSpellHandler)
	spells.DELETE("/:spellId", spellController.DeleteSpellHandler)

	tracker := characters.Group("/trackers")
	tracker.POST("", trackerController.CreateTrackerHandler)
	tracker.PUT("/:trackerId", trackerController.UpdateTrackerHandler)
	tracker.PATCH("/order", trackerController.UpdateTrackerOrderHandler)
	tracker.DELETE("/:trackerId", trackerController.DeleteTrackerHandler)

	noteCategories := characters.Group("/notes")
	noteCategories.POST("", noteController.CreateNoteCategoryHandler)
	noteCategories.PUT("/:categoryId", noteController.UpdateNoteCategoryHandler)
	noteCategories.DELETE("/:categoryId", noteController.DeleteNoteCategoryHandler)

	note := noteCategories.Group("/:categoryId", noteController.NoteMiddleware)
	note.POST("", noteController.CreateNoteHandler)
	note.PUT("/:noteId", noteController.UpdateNoteHandler)
	note.DELETE("/:noteId", noteController.DeleteNoteHandler)

	InitProxy(r)
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
