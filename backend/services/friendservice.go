package services

import (
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
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

func (s *FriendService) SendFriendRequest(userID int, friend *dto.UserDataDTO) error {
	friendModel, err := s.UserRepo.FindByEmail(friend.Email)
	if err != nil {
		return err
	}
	if s.IsUserFriend(userID, int(friendModel.ID)) {
		return gorm.ErrCheckConstraintViolated
	}
	*friend = *convertToUserDataDTO(friendModel)
	return s.Repo.SendFriendRequest(uint(userID), friendModel.ID)
}

func (s *FriendService) AcceptFriendRequest(userID int, friendRequestID int) error {
	return s.Repo.AcceptFriendRequest(uint(friendRequestID), uint(userID))
}

func (s *FriendService) DeclineFriendRequest(userID int, friendRequestID int) error {
	return s.Repo.DeclineFriendRequest(uint(friendRequestID), uint(userID))
}

func (s *FriendService) Unfriend(userID int, friendID int) error {
	return s.Repo.Unfriend(uint(userID), uint(friendID))
}

func (s *FriendService) UpdateName(userID int, friendID int, name string) error {
	return s.Repo.UpdateName(userID, friendID, name)
}

func (s *FriendService) ShareCharacter(userID int, friendID int, characterID int) error {
	Friend, err := s.Repo.GetUserFriend(uint(userID), uint(friendID))
	if err != nil {
		return err
	}
	return s.Repo.ShareCharacter(uint(characterID), Friend.ID)
}

func (s *FriendService) UnshareCharacter(userID int, friendID int, characterID int) error {
	FriendModel, err := s.Repo.GetUserFriend(uint(userID), uint(friendID))
	if err != nil {
		return err
	}
	return s.Repo.UnshareCharacter(uint(characterID), uint(FriendModel.ID))
}

func (s *FriendService) FindByUserIDAndFriendID(userID uint, friendID uint) ([]dto.CharacterBaseDTO, error) {
	characterShares, err := s.Repo.FindByUserIDAndFriendID(userID, friendID)
	if err != nil {
		return nil, err
	}
	return convertToCharacterBaseDTOs(characterShares), nil
}
