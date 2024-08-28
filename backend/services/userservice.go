package services

import (
	"errors"
	"strings"

	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/utility"
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

func (s *UserService) CreateUser(user *dto.UserDTO) (*models.UserModel, error) {
	// Hash the password before saving the user
	hashedPassword, err := utility.HashPassword(user.Password)
	if err != nil {
		return nil, err
	}
	user.Password = hashedPassword

	// Create the user in the database
	userModel := convertToUser(user)
	err = s.repo.Create(userModel)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			return nil, ErrUserExists
		}
		return nil, err
	}
	return userModel, nil
}

// Define specific error types
var ErrAuthenticationFailed = errors.New("authentication failed")

func (s *UserService) AuthenticateUser(user *dto.UserDTO) (int, error) {
	userModel, err := s.repo.FindByEmail(user.Email)
	if err != nil {
		if errors.Is(err, repositories.ErrUserNotFound) {
			// Do not disclose whether the user was not found or the password is incorrect
			return 0, ErrAuthenticationFailed
		}
		return 0, err // Internal error
	}
	if err := utility.CheckPasswordHash(user.Password, userModel.Password); err != nil {
		return 0, ErrAuthenticationFailed
	}
	return int(userModel.ID), nil
}

func convertToUser(userDTO *dto.UserDTO) *models.UserModel {
	return &models.UserModel{
		Email:    userDTO.Email,
		Password: userDTO.Password,
	}
}
