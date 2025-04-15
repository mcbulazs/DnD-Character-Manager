package repositories

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/test/helpers"
)

func TestSpellRepository_Create(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewSpellRepository(db)

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
	t.Run("Create Spell Success", func(t *testing.T) {
		spell := &models.CharacterSpellModel{
			CharacterID: character.ID,
			Name:        "New Spell",
			Description: "Test description",
			Level:       0,
			School:      "Evocation",
			CastingTime: "1 action",
			Range:       "120",
			Duration:    "1 minute",
			Active:      true,
			Components:  "V, S",
		}
		err := repo.CreateSpell(spell)
		assert.NoError(t, err)

		var savedSpell models.CharacterSpellModel
		err = db.First(&savedSpell, spell.ID).Error
		assert.NoError(t, err)

		assert.Equal(t, spell.Name, savedSpell.Name)
		assert.Equal(t, spell.Description, savedSpell.Description)
		assert.Equal(t, spell.Level, savedSpell.Level)
		assert.Equal(t, spell.School, savedSpell.School)
		assert.Equal(t, spell.CastingTime, savedSpell.CastingTime)
		assert.Equal(t, spell.Range, savedSpell.Range)
		assert.Equal(t, spell.Duration, savedSpell.Duration)
		assert.Equal(t, spell.Active, savedSpell.Active)
		assert.Equal(t, spell.Components, savedSpell.Components)
	})
	t.Run("Create Spell to non-existent character", func(t *testing.T) {
		spell := &models.CharacterSpellModel{
			CharacterID: 9999,
			Name:        "New Spell",
			Description: "Test description",
		}
		err := repo.CreateSpell(spell)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrForeignKeyViolated, err)
	})
}

func TestSpellRepository_Update(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewSpellRepository(db)

	t.Run("Update Spell Success", func(t *testing.T) {
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
		spell := &models.CharacterSpellModel{
			CharacterID: character.ID,
			Name:        "Old Spell",
			Description: "Old description",
			Level:       0,
			School:      "Evocation",
			CastingTime: "1 action",
			Range:       "120",
			Duration:    "1 minute",
			Active:      true,
			Components:  "V, S",
		}
		err = repo.CreateSpell(spell)
		assert.NoError(t, err)

		spell.Name = "Updated Spell"
		spell.Description = "Updated description"
		err = repo.UpdateSpell(spell)
		assert.NoError(t, err)

		var updatedSpell models.CharacterSpellModel
		err = db.First(&updatedSpell, spell.ID).Error
		assert.NoError(t, err)

		assert.Equal(t, spell.Name, updatedSpell.Name)
		assert.Equal(t, spell.Description, updatedSpell.Description)
	})

	t.Run("Update Spell with mismatched character", func(t *testing.T) {
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

		spell := models.CharacterSpellModel{
			CharacterID: character1.ID,
			Name:        "test",
			Description: "test",
			Level:       0,
			School:      "Evocation",
			CastingTime: "1 action",
			Range:       "120",
			Duration:    "1 minute",
			Active:      true,
			Components:  "V, S",
		}
		assert.NoError(t, repo.CreateSpell(&spell))

		spell.CharacterID = character2.ID
		err := repo.UpdateSpell(&spell)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Update spell with non-existent character", func(t *testing.T) {
		spell := &models.CharacterSpellModel{
			CharacterID: 9999, // Non-existent character ID
			Name:        "Spell",
			Description: "Description",
			Level:       0,
			School:      "Evocation",
			CastingTime: "1 action",
			Range:       "120",
			Duration:    "1 minute",
			Active:      true,
			Components:  "V, S",
		}
		err := repo.UpdateSpell(spell)
		assert.Error(t, err)
	})
}

func TestSpellRepository_Delete(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewSpellRepository(db)

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

	t.Run("Delete Spell Success", func(t *testing.T) {
		spell := &models.CharacterSpellModel{
			CharacterID: character.ID,
			Name:        "To Be Deleted",
			Description: "Will be deleted",
		}
		assert.NoError(t, repo.CreateSpell(spell))

		err := repo.DeleteSpell(int(spell.ID), int(character.ID))
		assert.NoError(t, err)

		var deletedSpell models.CharacterSpellModel
		err = db.First(&deletedSpell, spell.ID).Error
		assert.ErrorIs(t, err, gorm.ErrRecordNotFound)
	})

	t.Run("Delete Non-existent Spell", func(t *testing.T) {
		err := repo.DeleteSpell(9999, int(character.ID))
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

		// Create a feature under character 1
		spell := &models.CharacterSpellModel{
			CharacterID: character.ID,
			Name:        "Unauthorized Delete",
			Description: "Shouldn't be deleted by another char",
		}
		assert.NoError(t, repo.CreateSpell(spell))

		// Attempt to delete it with character 2's ID
		err := repo.DeleteSpell(int(spell.ID), int(character2.ID))
		assert.ErrorIs(t, err, gorm.ErrRecordNotFound)

		// Confirm it's still in DB
		var stillThere models.CharacterSpellModel
		err = db.First(&stillThere, spell.ID).Error
		assert.NoError(t, err)
	})
}
