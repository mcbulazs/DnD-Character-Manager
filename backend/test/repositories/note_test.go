package repositories

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/test/helpers"
)

func TestNoteReposiory_CreateNoteCategory(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewNoteRepository(db)

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
	t.Run("Create noteCategory Success", func(t *testing.T) {
		noteCategory := &models.CharacterNoteCategoryModel{
			CharacterID: character.ID,
			Name:        "New Note",
			Description: "Test description",
		}
		err := repo.CreateNoteCategory(noteCategory)
		assert.NoError(t, err)

		var savedNoteCategory models.CharacterNoteCategoryModel
		err = db.First(&savedNoteCategory, noteCategory.ID).Error
		assert.NoError(t, err)

		assert.Equal(t, "New Note", savedNoteCategory.Name)
		assert.Equal(t, "Test description", savedNoteCategory.Description)
	})

	t.Run("Create Note to non-existent character", func(t *testing.T) {
		noteCategory := &models.CharacterNoteCategoryModel{
			CharacterID: 9999,
			Name:        "New Note",
			Description: "Test description",
		}
		err := repo.CreateNoteCategory(noteCategory)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrForeignKeyViolated, err)
	})
}

func TestNoteRepository_UpdateNoteCategory(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewNoteRepository(db)

	// Create user
	user := &models.UserModel{
		Email:    "update@test.com",
		Password: "password",
	}
	err := userRepo.Create(user)
	assert.NoError(t, err)

	// Create character
	character := &models.CharacterModel{
		UserID: user.ID,
		Name:   "Test Character",
		Class:  "Wizard",
		Race:   "Elf",
	}
	err = characterRepo.Create(character)
	assert.NoError(t, err)

	// Create valid note category
	noteCategory := &models.CharacterNoteCategoryModel{
		CharacterID: character.ID,
		Name:        "Original Name",
		Description: "Original Description",
	}
	err = repo.CreateNoteCategory(noteCategory)
	assert.NoError(t, err)

	t.Run("Update NoteCategory Success", func(t *testing.T) {
		noteCategory.Name = "Updated Name"
		noteCategory.Description = "Updated Description"

		err := repo.UpdateNoteCategory(noteCategory)
		assert.NoError(t, err)

		var updated models.CharacterNoteCategoryModel
		err = db.First(&updated, noteCategory.ID).Error
		assert.NoError(t, err)
		assert.Equal(t, "Updated Name", updated.Name)
		assert.Equal(t, "Updated Description", updated.Description)
	})

	t.Run("Mismatch Character and NoteCategory", func(t *testing.T) {
		// Create another character (for mismatch test)
		otherCharacter := &models.CharacterModel{
			UserID: user.ID,
			Name:   "Other Character",
			Class:  "Rogue",
			Race:   "Halfling",
		}
		err = characterRepo.Create(otherCharacter)
		assert.NoError(t, err)
		noteCategoryMismatch := &models.CharacterNoteCategoryModel{
			CharacterID: otherCharacter.ID, // wrong character
			Name:        "Invalid Update",
			Description: "Should not be updated",
		}
		noteCategoryMismatch.ID = noteCategory.ID
		err := repo.UpdateNoteCategory(noteCategoryMismatch)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Non-existent NoteCategory", func(t *testing.T) {
		nonExistent := &models.CharacterNoteCategoryModel{
			CharacterID: character.ID,
			Name:        "Ghost",
			Description: "Does not exist",
		}
		nonExistent.ID = 999
		err := repo.UpdateNoteCategory(nonExistent)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestNoteRepository_DeleteNoteCategory(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewNoteRepository(db)

	// Create user
	user := &models.UserModel{
		Email:    "deletenote@test.com",
		Password: "password",
	}
	err := userRepo.Create(user)
	assert.NoError(t, err)

	// Create characters
	character := &models.CharacterModel{
		UserID: user.ID,
		Name:   "Delete Character",
		Class:  "Cleric",
		Race:   "Dwarf",
	}
	err = characterRepo.Create(character)
	assert.NoError(t, err)

	// Create note category
	category := &models.CharacterNoteCategoryModel{
		CharacterID: character.ID,
		Name:        "Deletable Category",
		Description: "To be deleted",
	}
	err = repo.CreateNoteCategory(category)
	assert.NoError(t, err)

	// Create a note in that category
	note := &models.CharacterNoteModel{
		CategoryID: category.ID,
		Note:       "Note content",
	}
	err = db.Create(note).Error
	assert.NoError(t, err)

	t.Run("Delete Category Success", func(t *testing.T) {
		err := repo.DeleteNoteCategory(int(category.ID), int(character.ID))
		assert.NoError(t, err)

		// Ensure category is deleted
		var deletedCategory models.CharacterNoteCategoryModel
		err = db.First(&deletedCategory, category.ID).Error
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)

		// Ensure note is also deleted
		var deletedNote models.CharacterNoteModel
		err = db.First(&deletedNote, note.ID).Error
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Mismatch Character and Category", func(t *testing.T) {
		otherCharacter := &models.CharacterModel{
			UserID: user.ID,
			Name:   "Other Delete Char",
			Class:  "Paladin",
			Race:   "Human",
		}
		err = characterRepo.Create(otherCharacter)
		assert.NoError(t, err)

		// Create new category under character
		mismatchCategory := &models.CharacterNoteCategoryModel{
			CharacterID: character.ID,
			Name:        "Mismatch Category",
			Description: "Should not be deleted by wrong char",
		}
		err := repo.CreateNoteCategory(mismatchCategory)
		assert.NoError(t, err)

		err = repo.DeleteNoteCategory(int(mismatchCategory.ID), int(otherCharacter.ID))
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Non-existent Category", func(t *testing.T) {
		err := repo.DeleteNoteCategory(9999, int(character.ID))
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestNoteRepository_CreateNote(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewNoteRepository(db)

	// Setup: Create user and character
	user := &models.UserModel{
		Email:    "noteuser@test.com",
		Password: "secure",
	}
	err := userRepo.Create(user)
	assert.NoError(t, err)

	character := &models.CharacterModel{
		UserID: user.ID,
		Name:   "Note Taker",
		Class:  "Wizard",
		Race:   "Elf",
	}
	err = characterRepo.Create(character)
	assert.NoError(t, err)

	// Setup: Create note category
	category := &models.CharacterNoteCategoryModel{
		CharacterID: character.ID,
		Name:        "Important Notes",
		Description: "For all the crucial info",
	}
	err = repo.CreateNoteCategory(category)
	assert.NoError(t, err)

	t.Run("Create Note Success", func(t *testing.T) {
		note := &models.CharacterNoteModel{
			CategoryID: category.ID,
			Note:       "This is a test note.",
		}
		err := repo.CreateNote(note)
		assert.NoError(t, err)

		var savedNote models.CharacterNoteModel
		err = db.First(&savedNote, note.ID).Error
		assert.NoError(t, err)
		assert.Equal(t, "This is a test note.", savedNote.Note)
		assert.Equal(t, category.ID, savedNote.CategoryID)
	})

	t.Run("Create Note - Invalid Category", func(t *testing.T) {
		note := &models.CharacterNoteModel{
			CategoryID: 9999, // non-existent
			Note:       "Should fail",
		}
		err := repo.CreateNote(note)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrForeignKeyViolated, err)
	})
}

func TestNoteRepository_UpdateNote(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewNoteRepository(db)

	// Setup: Create user and character
	user := &models.UserModel{Email: "update@test.com", Password: "pw"}
	assert.NoError(t, userRepo.Create(user))

	character := &models.CharacterModel{
		UserID: user.ID,
		Name:   "Update Char",
		Class:  "Cleric",
		Race:   "Dwarf",
	}
	assert.NoError(t, characterRepo.Create(character))

	// Setup: Create two categories
	cat1 := &models.CharacterNoteCategoryModel{
		CharacterID: character.ID,
		Name:        "First",
		Description: "Main category",
	}
	assert.NoError(t, repo.CreateNoteCategory(cat1))

	// Setup: Create a note
	note := &models.CharacterNoteModel{
		CategoryID: cat1.ID,
		Note:       "Initial Note",
	}
	assert.NoError(t, repo.CreateNote(note))

	t.Run("Update Note Success", func(t *testing.T) {
		note.Note = "Updated Note Content"
		err := repo.UpdateNote(note, int(cat1.ID))
		assert.NoError(t, err)

		var updated models.CharacterNoteModel
		err = db.First(&updated, note.ID).Error
		assert.NoError(t, err)
		assert.Equal(t, "Updated Note Content", updated.Note)
	})

	t.Run("Update Note - Mismatched Category", func(t *testing.T) {
		cat2 := &models.CharacterNoteCategoryModel{
			CharacterID: character.ID,
			Name:        "Second",
			Description: "For mismatch test",
		}
		assert.NoError(t, repo.CreateNoteCategory(cat2))

		note.Note = "Should Not Update"
		err := repo.UpdateNote(note, int(cat2.ID)) // mismatched category
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Update Note - Non-existent Note", func(t *testing.T) {
		bogus := &models.CharacterNoteModel{
			Model:      gorm.Model{ID: 9999},
			CategoryID: cat1.ID,
			Note:       "Ghost Note",
		}
		err := repo.UpdateNote(bogus, int(cat1.ID))
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestNoteRepository_DeleteNote(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewNoteRepository(db)

	// Setup user and character
	user := &models.UserModel{Email: "deletenote@test.com", Password: "secure"}
	assert.NoError(t, userRepo.Create(user))

	character := &models.CharacterModel{
		UserID: user.ID,
		Name:   "Delete Test Char",
		Class:  "Wizard",
		Race:   "Elf",
	}
	assert.NoError(t, characterRepo.Create(character))

	// Setup category
	category := &models.CharacterNoteCategoryModel{
		CharacterID: character.ID,
		Name:        "Delete Test Category",
		Description: "To delete notes from",
	}
	assert.NoError(t, repo.CreateNoteCategory(category))

	// Setup note
	note := &models.CharacterNoteModel{
		CategoryID: category.ID,
		Note:       "This is a deletable note",
	}
	assert.NoError(t, repo.CreateNote(note))

	t.Run("Delete Note - Success", func(t *testing.T) {
		err := repo.DeleteNote(int(note.ID), int(category.ID))
		assert.NoError(t, err)

		var count int64
		db.Model(&models.CharacterNoteModel{}).Where("id = ?", note.ID).Count(&count)
		assert.Equal(t, int64(0), count)
	})

	t.Run("Delete Note - Wrong Category", func(t *testing.T) {
		// Setup a second category for mismatch case
		categoryMismatch := &models.CharacterNoteCategoryModel{
			CharacterID: character.ID,
			Name:        "Mismatch",
			Description: "Wrong category",
		}
		assert.NoError(t, repo.CreateNoteCategory(categoryMismatch))

		note := &models.CharacterNoteModel{
			CategoryID: category.ID,
			Note:       "Mismatch note",
		}
		assert.NoError(t, repo.CreateNote(note))

		err := repo.DeleteNote(int(note.ID), int(categoryMismatch.ID))
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Delete Note - Non-existent Note", func(t *testing.T) {
		err := repo.DeleteNote(99999, int(category.ID))
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestNoteRepository_IsCategoryBelongToCharacter(t *testing.T) {
	// Set up a test database
	db := helpers.SetupTestDB(t) // You can replace this with your actual test DB setup
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	repo := repositories.NewNoteRepository(db)

	// Create a user for the test
	user := &models.UserModel{
		Email:    "test@example.com",
		Password: "password123",
	}
	err := userRepo.Create(user)
	assert.NoError(t, err)

	// Create a character for the user
	character := models.CharacterModel{
		UserID: user.ID,
		Name:   "Test Character",
		Class:  "Warrior",
		Race:   "Elf",
	}
	err = characterRepo.Create(&character)
	assert.NoError(t, err)

	// Create a note category associated with the character
	noteCategory := &models.CharacterNoteCategoryModel{
		CharacterID: character.ID,
		Name:        "Test Category",
		Description: "A category for notes",
	}
	err = repo.CreateNoteCategory(noteCategory)
	assert.NoError(t, err)

	t.Run("Category belongs to character", func(t *testing.T) {
		// Test that the note category belongs to the correct character
		result := repo.IsCategoryBelongToCharacter(int(noteCategory.ID), int(character.ID))
		assert.True(t, result, "Category should belong to the given character")
	})

	t.Run("Category does not belong to character", func(t *testing.T) {
		// Test that the note category does not belong to a different character
		invalidCharacterID := character.ID + 1 // Using an invalid character ID
		result := repo.IsCategoryBelongToCharacter(int(noteCategory.ID), int(invalidCharacterID))
		assert.False(t, result, "Category should not belong to the given character")
	})

	t.Run("Category not found", func(t *testing.T) {
		// Test that a non-existent category returns false
		result := repo.IsCategoryBelongToCharacter(9999, int(character.ID)) // Using a non-existent category ID
		assert.False(t, result, "Category should not be found")
	})
}
