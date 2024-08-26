package models

import (
	"gorm.io/gorm"
)

type UserModel struct {
	gorm.Model
	Email      string `gorm:"unique"`
	Password   string
	Characters []CharacterModel `gorm:"foreignKey:UserID"`
}

func (u *UserModel) TableName() string {
	return "users"
}
