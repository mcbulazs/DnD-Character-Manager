package repositories

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/test/helpers"
)

func TestFeatureRepository_Create(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewFeatureRepository(db)

	userResult := &models.UserModel{
		Email:    "test",
		Password: "test",
	}
	err := userRepo.Create(userResult)
	assert.NoError(t, err)

	character := models.CharacterModel{
		UserID: userResult.ID,
		Name:   "test name",
		Class:  "Fighter",
		Race:   "Human",
	}
	err = characterRepo.Create(&character)
	assert.NoError(t, err)
	t.Run("Create Feature Success", func(t *testing.T) {
		feature := &models.CharacterFeatureModel{
			CharacterID: character.ID,
			Name:        "New Feature",
			Description: "Test description",
		}
		err := repo.CreateFeature(feature)
		assert.NoError(t, err)

		var savedFeature models.CharacterFeatureModel
		err = db.First(&savedFeature, feature.ID).Error
		assert.NoError(t, err)

		assert.Equal(t, feature.Name, savedFeature.Name)
		assert.Equal(t, feature.Description, savedFeature.Description)
	})

	t.Run("Create Feature to non-existent character", func(t *testing.T) {
		feature := &models.CharacterFeatureModel{
			CharacterID: 9999,
			Name:        "New Feature",
			Description: "Test description",
		}
		err := repo.CreateFeature(feature)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrForeignKeyViolated, err)
	})
}

func TestFeatureRepository_Update(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewFeatureRepository(db)

	t.Run("Update Feature Success", func(t *testing.T) {
		userResult := &models.UserModel{
			Email:    "test",
			Password: "test",
		}
		err := userRepo.Create(userResult)
		assert.NoError(t, err)

		character := models.CharacterModel{
			UserID: userResult.ID,
			Name:   "test name",
			Class:  "Fighter",
			Race:   "Human",
		}
		err = characterRepo.Create(&character)
		assert.NoError(t, err)
		// First, create a feature
		feature := &models.CharacterFeatureModel{
			CharacterID: character.ID,
			Name:        "Old Feature",
			Description: "Old description",
		}
		err = repo.CreateFeature(feature)
		assert.NoError(t, err)

		// Now, update the feature
		feature.Name = "Updated Feature"
		feature.Description = "Updated description"
		err = repo.UpdateFeature(feature)
		assert.NoError(t, err)

		// Verify the feature was updated
		var updatedFeature models.CharacterFeatureModel
		err = db.First(&updatedFeature, feature.ID).Error
		assert.NoError(t, err)

		assert.Equal(t, feature.Name, updatedFeature.Name)
		assert.Equal(t, feature.Description, updatedFeature.Description)
	})

	t.Run("Update Feature with mismatched character", func(t *testing.T) {
		// Create a feature with a valid character
		user1 := &models.UserModel{
			Email:    "user1@options.com",
			Password: "password",
		}
		assert.NoError(t, userRepo.Create(user1))

		// Create character 1
		character1 := models.CharacterModel{
			UserID: user1.ID,
			Name:   "Char 1",
			Class:  "Warrior",
			Race:   "Human",
		}
		assert.NoError(t, characterRepo.Create(&character1))

		// Create user 2
		user2 := &models.UserModel{
			Email:    "user2@options.com",
			Password: "password",
		}
		assert.NoError(t, userRepo.Create(user2))

		// Create character 2
		character2 := models.CharacterModel{
			UserID: user2.ID,
			Name:   "Char 2",
			Class:  "Mage",
			Race:   "Elf",
		}
		assert.NoError(t, characterRepo.Create(&character2))

		// Create character options for character 1
		feature := models.CharacterFeatureModel{
			CharacterID: character1.ID,
			Name:        "test",
			Description: "test",
			Source:      "test",
		}
		assert.NoError(t, repo.CreateFeature(&feature))

		// Attempt to update options for character 1 from character 2's perspective (should fail)
		feature.CharacterID = character2.ID // Character 2 tries to update character 1's options
		err := repo.UpdateFeature(&feature)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Update Feature with non-existent character", func(t *testing.T) {
		feature := &models.CharacterFeatureModel{
			CharacterID: 9999, // Non-existent character ID
			Name:        "Feature",
			Description: "Description",
		}
		err := repo.UpdateFeature(feature)
		assert.Error(t, err)
	})
}

func TestFeatureRepository_Delete(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewFeatureRepository(db)

	user := &models.UserModel{
		Email:    "delete@test.com",
		Password: "password",
	}
	assert.NoError(t, userRepo.Create(user))

	character := models.CharacterModel{
		UserID: user.ID,
		Name:   "Delete Test Character",
		Class:  "Rogue",
		Race:   "Halfling",
	}
	assert.NoError(t, characterRepo.Create(&character))

	t.Run("Delete Feature Success", func(t *testing.T) {
		feature := &models.CharacterFeatureModel{
			CharacterID: character.ID,
			Name:        "To Be Deleted",
			Description: "Will be deleted",
		}
		assert.NoError(t, repo.CreateFeature(feature))

		err := repo.DeleteFeature(int(feature.ID), int(character.ID))
		assert.NoError(t, err)

		var deletedFeature models.CharacterFeatureModel
		err = db.First(&deletedFeature, feature.ID).Error
		assert.ErrorIs(t, err, gorm.ErrRecordNotFound)
	})

	t.Run("Delete Non-existent Feature", func(t *testing.T) {
		err := repo.DeleteFeature(9999, int(character.ID))
		assert.ErrorIs(t, err, gorm.ErrRecordNotFound)
	})

	t.Run("Delete Feature with mismatched character", func(t *testing.T) {
		// Create second user and character
		user2 := &models.UserModel{
			Email:    "anotheruser@test.com",
			Password: "password",
		}
		assert.NoError(t, userRepo.Create(user2))

		character2 := models.CharacterModel{
			UserID: user2.ID,
			Name:   "Wrong Char",
			Class:  "Druid",
			Race:   "Elf",
		}
		assert.NoError(t, characterRepo.Create(&character2))

		// Create a feature under character 1
		feature := &models.CharacterFeatureModel{
			CharacterID: character.ID,
			Name:        "Unauthorized Delete",
			Description: "Shouldn't be deleted by another char",
		}
		assert.NoError(t, repo.CreateFeature(feature))

		// Attempt to delete it with character 2's ID
		err := repo.DeleteFeature(int(feature.ID), int(character2.ID))
		assert.ErrorIs(t, err, gorm.ErrRecordNotFound)

		// Confirm it's still in DB
		var stillThere models.CharacterFeatureModel
		err = db.First(&stillThere, feature.ID).Error
		assert.NoError(t, err)
	})
}
