package services

import (
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
)

type FriendService struct {
	Repo     *repositories.FriendRepository
	UserRepo *repositories.UserRepository
}

func NewFriendService(DB *gorm.DB) *FriendService {
	return &FriendService{
		Repo:     repositories.NewFriendRepository(DB),
		UserRepo: repositories.NewUserRepository(DB),
	}
}

func (s *FriendService) IsUserFriend(userID int, friendID int) bool {
	Friend, err := s.Repo.GetUserFriend(uint(userID), uint(friendID))
	if err != nil || Friend == nil {
		return false
	}
	return true
}

func (s *FriendService) SendFriendRequest(userID int, friend *dto.UserDataDTO) (error, *models.UserModel) {
	friendModel, err := s.UserRepo.FindByEmail(friend.Email)
	if err != nil {
		return err, nil
	}
	if friendModel.ID == uint(userID) {
		return gorm.ErrCheckConstraintViolated, nil
	}
	userModel, err := s.UserRepo.FindByID(userID)
	if err != nil {
		return err, nil
	}
	if s.IsUserFriend(userID, int(friendModel.ID)) {
		return gorm.ErrCheckConstraintViolated, nil
	}
	*friend = *convertToUserDataDTO(friendModel)
	return s.Repo.SendFriendRequest(uint(userID), friendModel.ID), userModel
}

func (s *FriendService) AcceptFriendRequest(userID int, friendRequestID int) (error, *models.FriendRequestModel) {
	return s.Repo.AcceptFriendRequest(uint(friendRequestID), uint(userID))
}

func (s *FriendService) DeclineFriendRequest(userID int, friendRequestID int) (error, *models.FriendRequestModel) {
	return s.Repo.DeclineFriendRequest(uint(friendRequestID), uint(userID))
}

func (s *FriendService) Unfriend(userID int, friendID int) (error, *models.FriendsModel) {
	friendModel, err := s.Repo.GetUserFriend(uint(friendID), uint(userID))
	if err != nil {
		return err, nil
	}
	err = s.Repo.Unfriend(uint(userID), uint(friendID))
	if err != nil {
		return err, nil
	}
	return nil, friendModel
}

func (s *FriendService) UpdateName(userID int, friendID int, name string) error {
	return s.Repo.UpdateName(userID, friendID, name)
}

func (s *FriendService) ShareCharacter(userID int, friendID int, characterID int) (error, *models.FriendsModel) {
	Friend, err := s.Repo.GetUserFriend(uint(userID), uint(friendID))
	reverseFriendModel, err := s.Repo.GetUserFriend(uint(friendID), uint(userID))
	if err != nil {
		return err, nil
	}
	return s.Repo.ShareCharacter(uint(characterID), Friend.ID), reverseFriendModel
}

func (s *FriendService) UnshareCharacter(userID int, friendID int, characterID int) (error, *models.FriendsModel) {
	FriendModel, err := s.Repo.GetUserFriend(uint(userID), uint(friendID))
	reverseFriendModel, err := s.Repo.GetUserFriend(uint(friendID), uint(userID))
	if err != nil {
		return err, nil
	}
	return s.Repo.UnshareCharacter(uint(characterID), uint(FriendModel.ID)), reverseFriendModel
}

func (s *FriendService) FindByUserIDAndFriendID(userID uint, friendID uint) ([]dto.CharacterBaseDTO, error) {
	characterShares, err := s.Repo.FindByUserIDAndFriendID(userID, friendID)
	if err != nil {
		return nil, err
	}
	return convertToCharacterBaseDTOs(characterShares), nil
}
