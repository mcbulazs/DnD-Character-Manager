package utility

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"DnDCharacterSheet/utility"
)

func TestHashAndCheckPassword(t *testing.T) {
	password := "mySecurePassword123!"

	// Hash the password
	hashed, err := utility.HashPassword(password)
	assert.NoError(t, err)
	assert.NotEmpty(t, hashed)
	assert.NotEqual(t, password, hashed, "Hash should not be the same as the password")

	// Check correct password
	err = utility.CheckPasswordHash(password, hashed)
	assert.NoError(t, err)

	// Check incorrect password
	err = utility.CheckPasswordHash("wrongPassword", hashed)
	assert.Error(t, err)
}
