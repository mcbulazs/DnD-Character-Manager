package services

import (
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/utility"
	"errors"

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

// Define specific error types
var ErrAuthenticationFailed = errors.New("authentication failed")

// AuthenticateUser authenticates a user by email and password
// returns nil if the user is authenticated, otherwise returns an error
func (s *UserService) AuthenticateUser(email, password string) (int, error) {
	user, err := models.FindByEmail(s.DB, email)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			// Do not disclose whether the user was not found or the password is incorrect
			return 0, ErrAuthenticationFailed
		}
		return 0, err // Internal error
	}
	if err := utility.CheckPasswordHash(password, user.Password); err != nil {
		return 0, ErrAuthenticationFailed
	}
	return int(user.ID), nil
}
