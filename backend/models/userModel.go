package models

import (
	"errors"

	"gorm.io/gorm"
)

var ErrUserNotFound = errors.New("user not found")

type User struct {
	gorm.Model
	Email    string `gorm:"unique"`
	Password string
}

// Create inserts a new user into the database
func (user *User) Create(db *gorm.DB) error {
	tx := db.Create(user)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

// FindByEmail retrieves a user by their email
func FindByEmail(db *gorm.DB, email string) (*User, error) {
	var foundUser User
	tx := db.Where("email = ?", email).First(&foundUser)
	if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		return nil, ErrUserNotFound
	}
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &foundUser, nil
}
