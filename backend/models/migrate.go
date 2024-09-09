package models

import (
	"fmt"
	"log"

	"gorm.io/gorm"
)

func MigrateModels(db *gorm.DB) {
	err := db.AutoMigrate(
		&UserModel{},
		&CharacterModel{},
		&CharacterImageModel{},
		&CharacterAbilityScoreModel{},
		&CharacterSavingThrowModel{},
		&CharacterSkillModel{},
		&CharacterFeatureModel{},
		&CharacterSpellModel{},
	)
	if err != nil {
		log.Fatal("Failed to migrate models:", err)
	}
	fmt.Println("Successfully migrated models")
}
