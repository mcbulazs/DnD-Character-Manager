package repositories

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/test/helpers"
)

func TestTrackerRepository_Create(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewTrackerRepository(db)

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
	t.Run("Create Tracker Success", func(t *testing.T) {
		tracker := &models.CharacterTrackerModel{
			CharacterID:  character.ID,
			Name:         "New tracker",
			CurrentValue: 10,
			MaxValue:     20,
		}
		err := repo.CreateTracker(tracker)
		assert.NoError(t, err)

		var savedTracker models.CharacterTrackerModel
		err = db.First(&savedTracker, tracker.ID).Error
		assert.NoError(t, err)

		assert.Equal(t, "New tracker", savedTracker.Name)
		assert.Equal(t, 10, savedTracker.CurrentValue)
		assert.Equal(t, 20, savedTracker.MaxValue)
		assert.Equal(t, models.TrackerEnum.Custom, savedTracker.Type)
		assert.Equal(t, 3, savedTracker.TrackerOrder)

		tracker2 := &models.CharacterTrackerModel{
			CharacterID:  character.ID,
			Name:         "New tracker",
			CurrentValue: 10,
			MaxValue:     20,
		}
		err = repo.CreateTracker(tracker2)
		assert.NoError(t, err)

		var savedTracker2 models.CharacterTrackerModel
		err = db.First(&savedTracker2, tracker2.ID).Error
		assert.NoError(t, err)
		assert.Equal(t, 4, savedTracker2.TrackerOrder)
	})

	t.Run("Create Tracker to non-existent character", func(t *testing.T) {
		tracker := &models.CharacterTrackerModel{
			CharacterID:  9999,
			Name:         "New tracker",
			CurrentValue: 10,
			MaxValue:     20,
		}
		err := repo.CreateTracker(tracker)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrForeignKeyViolated, err)
	})
}

func TestTrackerRepository_Update(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewTrackerRepository(db)

	t.Run("Update Tracker Success", func(t *testing.T) {
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
		// First, create a tracker
		tracker := &models.CharacterTrackerModel{
			CharacterID:  character.ID,
			Name:         "Old Tracker",
			CurrentValue: 8,
			MaxValue:     15,
		}
		err = repo.CreateTracker(tracker)
		assert.NoError(t, err)

		// Now, update the tracker
		tracker.Name = "Updated Tracker"
		tracker.CurrentValue = 12
		tracker.MaxValue = 20
		err = repo.UpdateTracker(tracker)
		assert.NoError(t, err)

		// Verify the tracker was updated
		var updatedTracker models.CharacterTrackerModel
		err = db.First(&updatedTracker, tracker.ID).Error
		assert.NoError(t, err)

		assert.Equal(t, "Updated Tracker", updatedTracker.Name)
		assert.Equal(t, 12, updatedTracker.CurrentValue)
		assert.Equal(t, 20, updatedTracker.MaxValue)
	})

	t.Run("Update Tracker with mismatched character", func(t *testing.T) {
		// Create a tracker with a valid character
		user1 := &models.UserModel{
			Email:    "user1@example.com",
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
			Email:    "user2@example.com",
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

		// Create character tracker for character 1
		tracker := models.CharacterTrackerModel{
			CharacterID:  character1.ID,
			Name:         "test",
			CurrentValue: 10,
			MaxValue:     20,
		}
		assert.NoError(t, repo.CreateTracker(&tracker))

		// Attempt to update tracker for character 1 from character 2's perspective (should fail)
		tracker.CharacterID = character2.ID // Character 2 tries to update character 1's tracker
		err := repo.UpdateTracker(&tracker)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Update Tracker not custom type", func(t *testing.T) {
		userResult := &models.UserModel{
			Email:    "test4",
			Password: "test4",
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
		// First, create a tracker
		tracker := &models.CharacterTrackerModel{
			CharacterID:  character.ID,
			Name:         "Health",
			CurrentValue: 8,
			MaxValue:     15,
			Type:         models.TrackerEnum.Health,
		}
		err = repo.DB.Create(tracker).Error
		assert.NoError(t, err)

		// Now, update the tracker
		tracker.Name = "Updated Tracker"
		tracker.CurrentValue = 12
		tracker.MaxValue = 20
		tracker.Type = models.TrackerEnum.Custom // Change type to Custom
		err = repo.UpdateTracker(tracker)
		assert.NoError(t, err)

		// Verify the tracker was updated
		var updatedTracker models.CharacterTrackerModel
		err = db.First(&updatedTracker, tracker.ID).Error
		assert.NoError(t, err)

		assert.NotEqual(t, "Updated Tracker", updatedTracker.Name)
		assert.Equal(t, "Health", updatedTracker.Name)
		assert.Equal(t, 12, updatedTracker.CurrentValue)
		assert.Equal(t, 20, updatedTracker.MaxValue)
		assert.NotEqual(t, models.TrackerEnum.Custom, updatedTracker.Type)
		assert.Equal(t, models.TrackerEnum.Health, updatedTracker.Type)
	})

	t.Run("Update Tracker with non-existent character", func(t *testing.T) {
		tracker := &models.CharacterTrackerModel{
			CharacterID:  9999, // Non-existent character ID
			Name:         "Tracker",
			CurrentValue: 10,
			MaxValue:     20,
		}
		err := repo.UpdateTracker(tracker)
		assert.Error(t, err)
	})
}

func TestTrackerRepository_CreateDefaultTrackers(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
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
	err = db.Create(&character).Error
	assert.NoError(t, err)

	err = repositories.CreateDefaultTrackers(db, character.ID)
	assert.NoError(t, err)

	var trackers []models.CharacterTrackerModel
	err = db.Where("character_id = ?", character.ID).Find(&trackers).Error
	assert.NoError(t, err)
	assert.Equal(t, 13, len(trackers))
}

// Order untestable with sqlite

func TestTrackerRepository_Delete(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewTrackerRepository(db)

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
	t.Run("Create Tracker Success", func(t *testing.T) {
		tracker := &models.CharacterTrackerModel{
			CharacterID:  character.ID,
			Name:         "New tracker",
			CurrentValue: 10,
			MaxValue:     20,
		}
		err := repo.CreateTracker(tracker)
		assert.NoError(t, err)

		err = repo.DeleteTracker(int(character.ID), int(tracker.ID))
		assert.NoError(t, err)
	})
	t.Run("Delete Tracker with not cutom type", func(t *testing.T) {
		tracker := &models.CharacterTrackerModel{
			CharacterID:  character.ID,
			Name:         "New tracker",
			CurrentValue: 10,
			MaxValue:     20,
			Type:         models.TrackerEnum.Health,
		}
		err := db.Create(tracker).Error
		assert.NoError(t, err)

		err = repo.DeleteTracker(int(character.ID), int(tracker.ID))
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Delete Non-existent Tracker", func(t *testing.T) {
		err := repo.DeleteTracker(9999, int(character.ID))
		assert.ErrorIs(t, err, gorm.ErrRecordNotFound)
	})

	t.Run("Delete Spell with mismatched character", func(t *testing.T) {
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

		tracker := &models.CharacterTrackerModel{
			CharacterID:  character.ID,
			Name:         "Unauthorized Delete",
			MaxValue:     10,
			CurrentValue: 10,
		}
		assert.NoError(t, repo.CreateTracker(tracker))

		// Attempt to delete it with character 2's ID
		err := repo.DeleteTracker(int(tracker.ID), int(character2.ID))
		assert.ErrorIs(t, err, gorm.ErrRecordNotFound)

		// Confirm it's still in DB
		var stillThere models.CharacterTrackerModel
		err = db.First(&stillThere, tracker.ID).Error
		assert.NoError(t, err)
	})
}
