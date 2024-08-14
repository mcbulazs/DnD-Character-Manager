package services

import (
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/utility"

	"gorm.io/gorm"
)

type UserService struct {
	DB *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{DB: db}
}

func (s *UserService) CreateUser(user *models.User) error {
	// Hash the password before saving the user
	hashedPassword, err := utility.HashPassword(user.Password)
	if err != nil {
		return err
	}
	user.Password = hashedPassword

	// Create the user in the database
	return user.Create(s.DB)
}

// returns nil if the user is authenticated, otherwise returns an error
func (s *UserService) AuthenticateUser(email, password string) (int, error) {
	user, err := models.FindByEmail(s.DB, email)
	if err != nil {
		return 0, err
	}
	if err := utility.CheckPasswordHash(password, user.Password); err != nil {
		return 0, err
	}
	return int(user.ID), nil
}
