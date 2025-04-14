package repositories

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/test/helpers"
)

func TestCharacterRepository_Create(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	repo := repositories.NewCharacterRepository(db)

	t.Run("Create Character Success", func(t *testing.T) {
		userResult := &models.UserModel{
			Email:    "test",
			Password: "test",
		}
		userRepo.Create(userResult)
		character := models.CharacterModel{
			UserID: userResult.ID,
			Name:   "test name",
			Class:  "Fighter",
			Race:   "Human",
		}

		err := repo.Create(&character)
		assert.NoError(t, err)
		assert.NotZero(t, character.ID)
	})
	t.Run("Create Character Fail", func(t *testing.T) {
		character := models.CharacterModel{
			UserID: 999,
			Name:   "test name",
			Class:  "Fighter",
			Race:   "Human",
		}

		err := repo.Create(&character)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrForeignKeyViolated, err)
	})
}

func TestCharacterRepository_FindByID(t *testing.T) {
	db := helpers.SetupTestDB(t)
	repo := repositories.NewCharacterRepository(db)
	userRepo := repositories.NewUserRepository(db)

	t.Run("Find Character By ID Success", func(t *testing.T) {
		// Create a test user
		userResult := &models.UserModel{
			Email:    "test@example.com",
			Password: "password123",
		}
		err := userRepo.Create(userResult)
		assert.NoError(t, err)

		// Create a test character for the user
		character := models.CharacterModel{
			UserID: userResult.ID,
			Name:   "Test Character",
			Class:  "Warrior",
			Race:   "Elf",
		}
		err = repo.Create(&character)
		assert.NoError(t, err)

		// Test FindByID
		foundCharacter, err := repo.FindByID(int(character.ID))
		assert.NoError(t, err)
		assert.NotNil(t, foundCharacter)
		assert.Equal(t, character.Name, foundCharacter.Name)
		assert.Equal(t, character.UserID, foundCharacter.UserID)
	})

	t.Run("Find Character By ID Not Found", func(t *testing.T) {
		// Try to find a character that doesn't exist
		foundCharacter, err := repo.FindByID(999999)
		assert.Error(t, err)
		assert.Nil(t, foundCharacter)
	})
}

func TestCharacterRepository_IsUserCharacter(t *testing.T) {
	db := helpers.SetupTestDB(t)
	repo := repositories.NewCharacterRepository(db)
	userRepo := repositories.NewUserRepository(db)

	// Create a test user
	userResult := &models.UserModel{
		Email:    "test@example.com",
		Password: "password123",
	}
	err := userRepo.Create(userResult)
	assert.NoError(t, err)
	t.Run("Is User's Character", func(t *testing.T) {
		// Create a test character for the user
		character := models.CharacterModel{
			UserID: userResult.ID,
			Name:   "Test Character",
			Class:  "Warrior",
			Race:   "Elf",
		}
		err = repo.Create(&character)
		assert.NoError(t, err)

		// Test that the character belongs to the user
		isUserCharacter := repo.IsUserCharacter(int(userResult.ID), int(character.ID))
		assert.True(t, isUserCharacter)
	})

	t.Run("Is Not User's Character", func(t *testing.T) {
		// Create another test user and character for them
		otherUser := &models.UserModel{
			Email:    "other@example.com",
			Password: "password456",
		}
		err = userRepo.Create(otherUser)
		assert.NoError(t, err)

		otherCharacter := models.CharacterModel{
			UserID: otherUser.ID,
			Name:   "Other Character",
			Class:  "Mage",
			Race:   "Human",
		}
		err = repo.Create(&otherCharacter)
		assert.NoError(t, err)

		// Test that the character does not belong to the first user
		isUserCharacter := repo.IsUserCharacter(int(userResult.ID), int(otherCharacter.ID))
		assert.False(t, isUserCharacter)
	})

	t.Run("Character Does Not Exist", func(t *testing.T) {
		// Test that when a character does not exist, it returns false
		isUserCharacter := repo.IsUserCharacter(1, 999999)
		assert.False(t, isUserCharacter)
	})
}

func TestCharacterRepository_Delete(t *testing.T) {
	db := helpers.SetupTestDB(t)
	repo := repositories.NewCharacterRepository(db)
	userRepo := repositories.NewUserRepository(db)

	// Create a test user
	userResult := &models.UserModel{
		Email:    "test@example.com",
		Password: "password123",
	}
	err := userRepo.Create(userResult)
	assert.NoError(t, err)

	t.Run("Delete Character Success", func(t *testing.T) {
		// Create a test character for the user
		character := models.CharacterModel{
			UserID: userResult.ID,
			Name:   "Test Character",
			Class:  "Warrior",
			Race:   "Elf",
		}
		err = repo.Create(&character)
		assert.NoError(t, err)

		// Now delete the character
		err = repo.Delete(int(character.ID), int(userResult.ID))
		assert.NoError(t, err)

		// Verify that the character was deleted
		var deletedCharacter models.CharacterModel
		tx := db.First(&deletedCharacter, character.ID)
		assert.Error(t, tx.Error) // It should return an error as the character should no longer exist
		assert.Equal(t, gorm.ErrRecordNotFound, tx.Error)
	})

	t.Run("Delete Character Not Belonging to User", func(t *testing.T) {
		otherUser := &models.UserModel{
			Email:    "other@example.com",
			Password: "password456",
		}
		err = userRepo.Create(otherUser)
		assert.NoError(t, err)

		// Create a test character for the other user
		character := models.CharacterModel{
			UserID: otherUser.ID,
			Name:   "Other Character",
			Class:  "Mage",
			Race:   "Human",
		}
		err = repo.Create(&character)
		assert.NoError(t, err)

		// Attempt to delete a character that does not belong to the current user
		err = repo.Delete(int(character.ID), int(userResult.ID))
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Delete Non-Existent Character", func(t *testing.T) {
		// Attempt to delete a character that does not exist
		err := repo.Delete(999999, 1) // Non-existent character ID
		assert.Error(t, err)          // It should return an error since the character does not exist
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestCharacterRepository_UpdateAbilityScores(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	repo := repositories.NewCharacterRepository(db)

	t.Run("Update Ability Scores Success", func(t *testing.T) {
		// Create user
		user := &models.UserModel{
			Email:    "update@ability.com",
			Password: "password",
		}
		assert.NoError(t, userRepo.Create(user))

		// Create character
		character := models.CharacterModel{
			UserID: user.ID,
			Name:   "Ability Char",
			Class:  "Wizard",
			Race:   "Elf",
		}
		assert.NoError(t, repo.Create(&character))

		// Modify ability scores
		character.AbilityScores.Strength = models.Attribute{
			Value:    15,
			Modifier: 2,
		}
		character.AbilityScores.Intelligence = models.Attribute{
			Value:    18,
			Modifier: 4,
		}

		err := repo.UpdateAbilityScores(&character.AbilityScores)
		assert.NoError(t, err)

		// Fetch from DB and verify update
		var updated models.CharacterAbilityScoreModel
		tx := db.Where("character_id = ?", character.ID).First(&updated)
		assert.NoError(t, tx.Error)
		assert.Equal(t, 15, updated.Strength.Value)
		assert.Equal(t, 2, updated.Strength.Modifier)
		assert.Equal(t, 18, updated.Intelligence.Value)
		assert.Equal(t, 4, updated.Intelligence.Modifier)
	})

	t.Run("Update Ability Scores Fail (nonexistent character)", func(t *testing.T) {
		bogus := models.CharacterAbilityScoreModel{
			CharacterID: 999999,
			Strength: models.Attribute{
				Value:    10,
				Modifier: 0,
			},
		}
		err := repo.UpdateAbilityScores(&bogus)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestCharacterRepository_UpdateSkills(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	repo := repositories.NewCharacterRepository(db)

	t.Run("Update Skills Success", func(t *testing.T) {
		user := &models.UserModel{
			Email:    "skills@success.com",
			Password: "pass",
		}
		assert.NoError(t, userRepo.Create(user))

		character := models.CharacterModel{
			UserID: user.ID,
			Name:   "Skill Tester",
			Class:  "Rogue",
			Race:   "Halfling",
		}
		assert.NoError(t, repo.Create(&character))

		character.Skills.Stealth = models.Skill{
			ProficientAttribute: models.ProficientAttribute{
				Modifier:   3,
				Proficient: true,
			},
			Expertise: true,
		}
		character.Skills.Acrobatics = models.Skill{
			ProficientAttribute: models.ProficientAttribute{
				Modifier:   2,
				Proficient: true,
			},
			Expertise: false,
		}

		err := repo.UpdateSkills(&character.Skills)
		assert.NoError(t, err)

		var updated models.CharacterSkillModel
		tx := db.Where("character_id = ?", character.ID).First(&updated)
		assert.NoError(t, tx.Error)

		assert.Equal(t, 3, updated.Stealth.Modifier)
		assert.True(t, updated.Stealth.Proficient)
		assert.True(t, updated.Stealth.Expertise)

		assert.Equal(t, 2, updated.Acrobatics.Modifier)
		assert.True(t, updated.Acrobatics.Proficient)
		assert.False(t, updated.Acrobatics.Expertise)
	})

	t.Run("Update Skills Fail (nonexistent character)", func(t *testing.T) {
		skills := models.CharacterSkillModel{
			CharacterID: 999999,
			Investigation: models.Skill{
				ProficientAttribute: models.ProficientAttribute{
					Modifier:   5,
					Proficient: true,
				},
				Expertise: false,
			},
		}

		err := repo.UpdateSkills(&skills)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestCharacterRepository_UpdateSavingThrows(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	repo := repositories.NewCharacterRepository(db)

	t.Run("Update Saving Throws Success", func(t *testing.T) {
		user := &models.UserModel{
			Email:    "save@throws.com",
			Password: "secure",
		}
		assert.NoError(t, userRepo.Create(user))

		character := models.CharacterModel{
			UserID: user.ID,
			Name:   "Saves Mage",
			Class:  "Cleric",
			Race:   "Human",
		}
		assert.NoError(t, repo.Create(&character))

		character.SavingThrows.Wisdom = models.ProficientAttribute{
			Modifier:   4,
			Proficient: true,
		}
		character.SavingThrows.Charisma = models.ProficientAttribute{
			Modifier:   1,
			Proficient: false,
		}

		err := repo.UpdateSavingThrows(&character.SavingThrows)
		assert.NoError(t, err)

		var updated models.CharacterSavingThrowModel
		tx := db.Where("character_id = ?", character.ID).First(&updated)
		assert.NoError(t, tx.Error)

		assert.Equal(t, 4, updated.Wisdom.Modifier)
		assert.True(t, updated.Wisdom.Proficient)

		assert.Equal(t, 1, updated.Charisma.Modifier)
		assert.False(t, updated.Charisma.Proficient)
	})

	t.Run("Update Saving Throws Fail (nonexistent character)", func(t *testing.T) {
		saves := models.CharacterSavingThrowModel{
			CharacterID: 999999,
			Strength: models.ProficientAttribute{
				Modifier:   3,
				Proficient: true,
			},
		}

		err := repo.UpdateSavingThrows(&saves)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestCharacterRepository_UpdateImage(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	repo := repositories.NewCharacterRepository(db)

	t.Run("Update Image Success", func(t *testing.T) {
		user := &models.UserModel{
			Email:    "image@success.com",
			Password: "password",
		}
		assert.NoError(t, userRepo.Create(user))

		character := models.CharacterModel{
			UserID: user.ID,
			Name:   "ImageChar",
			Class:  "Rogue",
			Race:   "Goblin",
			Image: models.CharacterImageModel{
				BackgroundImage:    "old.png",
				BackgroundSize:     "cover",
				BackgroundPosition: "center",
			},
		}
		assert.NoError(t, repo.Create(&character))

		character.Image.BackgroundImage = "new-image.png"
		character.Image.BackgroundSize = "contain"
		character.Image.BackgroundPosition = "bottom"

		err := repo.UpdateImage(&character.Image)
		assert.NoError(t, err)

		var updated models.CharacterImageModel
		tx := db.Where("character_id = ?", character.ID).First(&updated)
		assert.NoError(t, tx.Error)
		assert.Equal(t, "new-image.png", updated.BackgroundImage)
		assert.Equal(t, "contain", updated.BackgroundSize)
		assert.Equal(t, "bottom", updated.BackgroundPosition)
	})

	t.Run("Update Image Fail (nonexistent character)", func(t *testing.T) {
		img := &models.CharacterImageModel{
			CharacterID:        99999,
			BackgroundImage:    "doesnt-matter.png",
			BackgroundSize:     "contain",
			BackgroundPosition: "top",
		}
		err := repo.UpdateImage(img)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestCharacterRepository_UpdateCharacterAttributes(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	repo := repositories.NewCharacterRepository(db)

	t.Run("Update Character Attributes Success", func(t *testing.T) {
		user := &models.UserModel{
			Email:    "update@attributes.com",
			Password: "password",
		}
		assert.NoError(t, userRepo.Create(user))

		character := models.CharacterModel{
			UserID: user.ID,
			Name:   "AttributeChar",
			Class:  "Paladin",
			Race:   "Human",
		}
		assert.NoError(t, repo.Create(&character))

		// Set new attribute values
		updatedAttributes := []string{"name", "class"}
		character.Name = "UpdatedName"
		character.Class = "Barbarian"

		err := repo.UpdateCharacterAttributes(updatedAttributes, &character)
		assert.NoError(t, err)

		// Verify the attributes were updated
		var updated models.CharacterModel
		tx := db.Where("id = ?", character.ID).First(&updated)
		assert.NoError(t, tx.Error)
		assert.Equal(t, "UpdatedName", updated.Name)
		assert.Equal(t, "Barbarian", updated.Class)
	})

	t.Run("Update Character Attributes Fail (nonexistent character)", func(t *testing.T) {
		character := &models.CharacterModel{
			UserID: 1,
		}
		character.ID = 999999 // Non-existent character ID

		updatedAttributes := []string{"name", "class"}
		character.Name = "NonExistent"
		character.Class = "Sorcerer"

		err := repo.UpdateCharacterAttributes(updatedAttributes, character)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Update Character Attributes Fail (mismatched user)", func(t *testing.T) {
		user := &models.UserModel{
			Email:    "user@fail.com",
			Password: "password",
		}
		assert.NoError(t, userRepo.Create(user))

		character := models.CharacterModel{
			UserID: user.ID,
			Name:   "AnotherChar",
			Class:  "Ranger",
			Race:   "Elf",
		}
		assert.NoError(t, repo.Create(&character))

		// Mismatch: attempt to update with a different user
		mismatchedCharacter := &models.CharacterModel{
			UserID: user.ID + 1, // Simulate a different user
		}
		mismatchedCharacter.ID = character.ID

		updatedAttributes := []string{"name", "class"}
		mismatchedCharacter.Name = "Mismatched"
		mismatchedCharacter.Class = "Bard"

		err := repo.UpdateCharacterAttributes(updatedAttributes, mismatchedCharacter)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestCharacterRepository_UpdateCharacterOptions(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	repo := repositories.NewCharacterRepository(db)

	t.Run("Update Character Options Success", func(t *testing.T) {
		// Create user
		user := &models.UserModel{
			Email:    "update@options.com",
			Password: "password",
		}
		assert.NoError(t, userRepo.Create(user))

		// Create character
		character := models.CharacterModel{
			UserID: user.ID,
			Name:   "Options Char",
			Class:  "Warrior",
			Race:   "Human",
		}
		assert.NoError(t, repo.Create(&character))

		// Create and update character options
		options := models.CharacterOptionsModel{
			CharacterID: character.ID,
			IsCaster:    true,
			IsDead:      false,
			IsXp:        true,
			RollOption:  true,
		}
		assert.NoError(t, repo.UpdateCharacterOptions(&options))

		// Fetch from DB and verify update
		var updatedOptions models.CharacterOptionsModel
		tx := db.Where("character_id = ?", character.ID).First(&updatedOptions)
		assert.NoError(t, tx.Error)
		assert.Equal(t, true, updatedOptions.IsCaster)
		assert.Equal(t, false, updatedOptions.IsDead)
		assert.Equal(t, true, updatedOptions.IsXp)
		assert.Equal(t, true, updatedOptions.RollOption)
	})

	t.Run("Update Character Options Fail (nonexistent character)", func(t *testing.T) {
		bogusOptions := models.CharacterOptionsModel{
			CharacterID: 999999,
			IsCaster:    true,
			IsDead:      false,
			IsXp:        true,
			RollOption:  true,
		}
		err := repo.UpdateCharacterOptions(&bogusOptions)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}
