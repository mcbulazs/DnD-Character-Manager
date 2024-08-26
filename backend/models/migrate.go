package models

import (
	"fmt"
	"log"

	"gorm.io/gorm"
)

func MigrateModels(db *gorm.DB) {
	if err := db.AutoMigrate(&UserModel{}); err != nil {
		log.Fatal("Failed to migrate models:", err)
	}
	if err := db.AutoMigrate(&CharacterModel{}); err != nil {
		log.Fatal("Failed to migrate models:", err)
	}
	if err := db.AutoMigrate(&CharacterImageModel{}); err != nil {
		log.Fatal("Failed to migrate models:", err)
	}
	if err := db.AutoMigrate(&CharacterAbilityScoreModel{}); err != nil {
		log.Fatal("Failed to migrate models:", err)
	}
	fmt.Println("Successfully migrated models")
}
