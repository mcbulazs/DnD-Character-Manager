package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"

	ctrl "DnDCharacterSheet/controllers"
	db "DnDCharacterSheet/db"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/utility"
)

func main() {
	closer := utility.InitLogger()
	defer closer()
	// Connect to the database
	database := db.ConnectToDB()
	// Migrate models
	models.MigrateModels(database)

	// Initialize Gin router
	r := gin.Default()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	// Initialize controllers
	ctrl.InitControllers(r, database)

	// Start the server
	fmt.Println("Starting server on port 80")
	err := r.Run(":80")
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
