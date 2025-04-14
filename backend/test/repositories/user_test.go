package repositories

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/test/helpers"
)

func TestUserRepository_Create(t *testing.T) {
	db := helpers.SetupTestDB(t)
	repo := repositories.NewUserRepository(db)

	t.Run("Create User Success", func(t *testing.T) {
		user := &models.UserModel{
			Email:    "test@example.com",
			Password: "hashedPassword",
		}

		err := repo.Create(user)
		assert.NoError(t, err)
		assert.NotZero(t, user.ID)
	})
	t.Run("Create User Duplicate Email", func(t *testing.T) {
		user2 := &models.UserModel{
			Email:    "test@example.com",
			Password: "hashedPassword",
		}
		err := repo.Create(user2)
		assert.Error(t, err)
		assert.True(t, errors.Is(err, gorm.ErrDuplicatedKey))
	})
}

func TestUserRepository_FindByID(t *testing.T) {
	db := helpers.SetupTestDB(t)
	repo := repositories.NewUserRepository(db)

	// Create a user first
	user := &models.UserModel{
		Email:    "findme@example.com",
		Password: "pass",
	}
	err := repo.Create(user)
	assert.NoError(t, err)

	t.Run("FindByID Success", func(t *testing.T) {
		foundUser, err := repo.FindByID(int(user.ID))
		assert.NoError(t, err)
		assert.Equal(t, user.Email, foundUser.Email)
		assert.Equal(t, user.Password, foundUser.Password)
	})

	t.Run("FindByID Not Found", func(t *testing.T) {
		foundUser2, err := repo.FindByID(2)
		assert.Error(t, err)
		assert.Equal(t, err, gorm.ErrRecordNotFound)
		assert.Nil(t, foundUser2)
	})
}

func TestUserRepository_FindByEmail(t *testing.T) {
	db := helpers.SetupTestDB(t)
	repo := repositories.NewUserRepository(db)

	// Create a user first
	user := &models.UserModel{
		Email:    "findme@example.com",
		Password: "pass",
	}

	err := repo.Create(user)
	assert.NoError(t, err)
	t.Run("FindByEmail Success", func(t *testing.T) {
		foundUser, err := repo.FindByEmail("findme@example.com")
		assert.NoError(t, err)
		assert.Equal(t, user.ID, foundUser.ID)
	})
	t.Run("FindByEmail Not Found", func(t *testing.T) {
		foundUser2, err := repo.FindByEmail("nonexist@example.com")
		assert.Error(t, err)
		assert.Equal(t, err, gorm.ErrRecordNotFound)
		assert.Nil(t, foundUser2)
	})
}
