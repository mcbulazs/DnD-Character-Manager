package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectToDB() *gorm.DB {
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName :=os.Getenv("DB_NAME")
	dbHost := "postgres"
	connStr := fmt.Sprintf(
		"user=%s dbname=%s password=%s host=%s sslmode=disable",
		dbUser, dbName, dbPassword, dbHost)

	// Retry settings
	maxRetries := 10
	retryInterval := time.Second * 4

	var err error
	var db *gorm.DB

	for i := 0; i < maxRetries; i++ {
		db, err = gorm.Open(postgres.Open(connStr), &gorm.Config{})
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

func BeginTransaction(db *gorm.DB) (*gorm.DB, func(*error), error) {
	tx := db.Begin()
	if tx.Error != nil {
		return nil, nil, tx.Error
	}

	commitOrRollback := func(errPtr *error) {
		if *errPtr != nil {
			fmt.Println("Rolling back transaction due to error:", *errPtr)
			if rollbackErr := tx.Rollback().Error; rollbackErr != nil {
				fmt.Println("Error rolling back transaction:", rollbackErr)
			}
		} else {
			if commitErr := tx.Commit().Error; commitErr != nil {
				fmt.Println("Error committing transaction:", commitErr)
				*errPtr = commitErr
			}
		}
	}

	return tx, commitOrRollback, nil
}
