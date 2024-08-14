package db

import (
	"fmt"
	"log"
	"time"

	"DnDCharacterSheet/DB/models"

	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Context *gorm.DB

func Init_db() {
	connectToDB()
	fmt.Println("Successfully connected to the database")
	migrateModels()
}

func migrateModels() {
	err := Context.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("Failed to migrate models:", err)
	}
}

func connectToDB() {
	//! Change it
	// Retrieve database credentials from environment variables
	dbUser := "admin"                                                                                                  // os.Getenv("DB_USER")         // admin
	dbPassword := "Admin123"                                                                                           // os.Getenv("DB_PASSWORD") // Admin123
	dbName := "PSQL"                                                                                                   // os.Getenv("DB_NAME") // PSQL
	connStr := fmt.Sprintf("user=%s dbname=%s password=%s host=localhost sslmode=disable", dbUser, dbName, dbPassword) //! host=postgres
	//db, err := sql.Open("postgres", connStr)

	// Retry settings
	maxRetries := 10
	retryInterval := time.Second * 4

	// Retry loop to wait for the database to be available
	var err error
	for i := 0; i < maxRetries; i++ {
		Context, err = gorm.Open(postgres.Open(connStr), &gorm.Config{})
		if err == nil {
			// Test the connection
			sqlDB, err := Context.DB()
			if err == nil {
				if err = sqlDB.Ping(); err == nil {
					log.Println("Successfully connected to the database")
					break
				}
			}
		}

		log.Printf("Attempt %d: Database not ready yet. Retrying in %v...", i+1, retryInterval)
		time.Sleep(retryInterval)
	}
	if err != nil {
		log.Fatal("Failed to connect to the database after multiple attempts:", err)
	}

}

func BeginTransaction() (*gorm.DB, func(*error), error) {
	tx := Context.Begin()
	if tx.Error != nil {
		return nil, nil, tx.Error
	}

	commitOrRollback := func(errPtr *error) {
		if *errPtr != nil {
			// An error occurred, rollback the transaction
			fmt.Println("Rolling back transaction due to error:", *errPtr)
			rollbackErr := tx.Rollback().Error
			if rollbackErr != nil {
				fmt.Println("Error rolling back transaction:", rollbackErr)
			}
		} else {
			// No errors, commit the transaction
			commitErr := tx.Commit().Error
			if commitErr != nil {
				fmt.Println("Error committing transaction:", commitErr)
				*errPtr = commitErr
			}
		}
	}

	return tx, commitOrRollback, nil
}
