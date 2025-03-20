package repositories

import (
	"errors"

	"gorm.io/gorm"

	"DnDCharacterSheet/models"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

var ErrUserNotFound = errors.New("user not found")

func (r *UserRepository) Create(user *models.UserModel) error {
	tx := r.DB.Create(user)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *UserRepository) FindByID(id int) (*models.UserModel, error) {
	var foundUser models.UserModel
	tx := r.DB.Preload("Friends").First(&foundUser, id)
	if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		return nil, ErrUserNotFound
	}
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &foundUser, nil
}

func (r *UserRepository) FindByEmail(email string) (*models.UserModel, error) {
	var foundUser models.UserModel
	tx := r.DB.First(&foundUser, "email = ?", email)
	if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		return nil, ErrUserNotFound
	}
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &foundUser, nil
}
