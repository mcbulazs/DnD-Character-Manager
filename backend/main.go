package main

import (
	"log"

	"github.com/gin-gonic/gin"

	db "DnDCharacterSheet/DB"
	ctrl "DnDCharacterSheet/controllers"
	"DnDCharacterSheet/models"
)

func main() {
	// Connect to the database
	database := db.ConnectToDB()
	// Migrate models
	models.MigrateModels(database)

	// Initialize Gin router
	r := gin.Default()
	// Initialize controllers
	ctrl.InitControllers(r, database)

	// Start the server
	err := r.Run(":80")
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
