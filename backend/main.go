package main

import (
	db "DnDCharacterSheet/DB"
	ctrl "DnDCharacterSheet/controllers"
	"DnDCharacterSheet/models"
	"log"

	"github.com/gin-gonic/gin"
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
	err := r.Run(":3000")
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
