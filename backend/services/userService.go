package services

import (
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/utility"
	"errors"
	"strings"

	"gorm.io/gorm"
)

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{
		repo: repositories.NewUserRepository(db),
	}
}

var ErrUserExists = errors.New("user already exists")

func (s *UserService) CreateUser(user *models.User) error {
	// Hash the password before saving the user
	hashedPassword, err := utility.HashPassword(user.Password)
	if err != nil {
		return err
	}
	user.Password = hashedPassword

	// Create the user in the database
	err = s.repo.Create(user)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			return ErrUserExists
		}
		return err
	}
	return nil
}

// Define specific error types
var ErrAuthenticationFailed = errors.New("authentication failed")

func (s *UserService) AuthenticateUser(email, password string) (int, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		if errors.Is(err, repositories.ErrUserNotFound) {
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
