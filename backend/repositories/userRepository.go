package repositories

import (
	"DnDCharacterSheet/models"
	"errors"

	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

var ErrUserNotFound = errors.New("user not found")

func (r *UserRepository) Create(user *models.User) error {
	tx := r.DB.Create(user)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var foundUser models.User
	tx := r.DB.Where("email = ?", email).First(&foundUser)
	if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		return nil, ErrUserNotFound
	}
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &foundUser, nil
}
