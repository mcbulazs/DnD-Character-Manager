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

func (s *UserService) GetUserByID(id int) (*dto.UserDataDTO, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	var friends []dto.FriendDTO
	for _, friend := range user.Friends {
		friendDto := dto.FriendDTO{
			Friend: *convertToUserDataDTO(&friend.Friend),
			Name:   friend.Name,
			Note:   friend.Note,
		}
		friends = append(friends, friendDto)
	}
	var friendRequests []dto.FriendRequestDTO
	for _, friendRequest := range user.FriendRequestsBy {
		friendRequests = append(friendRequests, dto.FriendRequestDTO{
			ID:     friendRequest.ID,
			Sender: *convertToUserDataDTO(&friendRequest.SourceUser),
		})
	}
	userDTO := convertToUserDataDTO(user)
	userDTO.Friends = friends
	userDTO.FriendRequests = friendRequests
	return userDTO, nil
}

func (s *UserService) CreateUser(user *dto.AuthUserDTO) (*models.UserModel, error) {
	// Hash the password before saving the user
	hashedPassword, err := utility.HashPassword(user.Password)
	if err != nil {
		return nil, err
	}
	user.Password = hashedPassword

	// Create the user in the database
	userModel := convertToAuthUserModel(user)
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

func (s *UserService) AuthenticateUser(user *dto.AuthUserDTO) (int, error) {
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

func convertToAuthUserModel(userDTO *dto.AuthUserDTO) *models.UserModel {
	return &models.UserModel{
		Email:    userDTO.Email,
		Password: userDTO.Password,
	}
}

func convertToUserDataDTO(userModel *models.UserModel) *dto.UserDataDTO {
	return &dto.UserDataDTO{
		ID:         userModel.ID,
		Email:      userModel.Email,
		Characters: convertToCharacterBaseDTOs(userModel.Characters),
	}
}

func convertToUserModel(userDTO *dto.UserDataDTO) *models.UserModel {
	model := &models.UserModel{
		Email: userDTO.Email,
	}
	model.ID = uint(userDTO.ID)
	return model
}
