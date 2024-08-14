package models

import (
	"fmt"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"unique"`
	Password string
}

func (user *User) Create(db *gorm.DB) error {
	tx := db.Create(user)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func FindByEmail(db *gorm.DB, email string) (*User, error) {
	var foundUser User
	tx := db.Where("email = ?", email).First(&foundUser)
	if tx.Error != nil {
		return nil, tx.Error
	}
	fmt.Println("Found user:", foundUser)
	return &foundUser, nil
}
