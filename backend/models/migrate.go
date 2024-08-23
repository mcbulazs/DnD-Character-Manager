package models

import (
	"fmt"
	"log"

	"gorm.io/gorm"
)

func MigrateModels(db *gorm.DB) {
	if err := db.AutoMigrate(&User{}); err != nil {
		log.Fatal("Failed to migrate models:", err)
	}
	if err := db.AutoMigrate(&Character{}); err != nil {
		log.Fatal("Failed to migrate models:", err)
	}
	if err := db.AutoMigrate(&CharacterImage{}); err != nil {
		log.Fatal("Failed to migrate models:", err)
	}
	if err := db.AutoMigrate(&CharacterAbilityScore{}); err != nil {
		log.Fatal("Failed to migrate models:", err)
	}
	fmt.Println("Successfully migrated models")
}
