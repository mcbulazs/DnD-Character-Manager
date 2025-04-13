package db

import (
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"DnDCharacterSheet/env"
	"DnDCharacterSheet/utility"
)

func ConnectToDB() *gorm.DB {
	connStr := env.GetConnectionString()

	// Retry settings
	maxRetries := 10
	retryInterval := time.Second * 4

	var err error
	var db *gorm.DB

	for i := 0; i < maxRetries; i++ {
		db, err = gorm.Open(postgres.Open(connStr), &gorm.Config{
			Logger: utility.GormLogger,
		})
		if err == nil {
			sqlDB, err := db.DB()
			if err == nil {
				if err = sqlDB.Ping(); err == nil {
					log.Println("Successfully connected to the database")
					return db
				}
			}
		}

		log.Printf("Attempt %d: Database not ready yet. Retrying in %v...", i+1, retryInterval)
		time.Sleep(retryInterval)
	}

	log.Fatal("Failed to connect to the database after multiple attempts:", err)
	return nil
}
