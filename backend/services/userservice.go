package services

import (
	"errors"

	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/utility"
)

type UserRepositoryInterface interface {
	Create(user *models.UserModel) error
	FindByID(id int) (*models.UserModel, error)
	FindByEmail(email string) (*models.UserModel, error)
}

type UserService struct {
	Repo UserRepositoryInterface
}

func NewUserService(repo UserRepositoryInterface) *UserService {
	return &UserService{
		Repo: repo,
	}
}

func (s *UserService) GetUserByID(id int) (*dto.UserDataDTO, error) {
	user, err := s.Repo.FindByID(id)
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

	// Create the user in the database
	userModel := convertToAuthUserModel(user)
	userModel.Password = hashedPassword
	err = s.Repo.Create(userModel)
	if err != nil {
		return nil, err
	}
	return userModel, nil
}

// Define specific error types
var ErrAuthenticationFailed = errors.New("authentication failed")

func (s *UserService) AuthenticateUser(user *dto.AuthUserDTO) (int, error) {
	userModel, err := s.Repo.FindByEmail(user.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
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

func convertToUserDataDTOs(userModels []models.UserModel) []dto.UserDataDTO {
	var userDTOs []dto.UserDataDTO
	for _, userModel := range userModels {
		userDTOs = append(userDTOs, *convertToUserDataDTO(&userModel))
	}
	return userDTOs
}

func convertToUserDataModel(userDTO *dto.UserDataDTO) *models.UserModel {
	model := &models.UserModel{
		Email: userDTO.Email,
	}
	model.ID = uint(userDTO.ID)
	return model
}
