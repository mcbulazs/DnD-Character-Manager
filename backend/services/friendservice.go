package services

import (
	"gorm.io/gorm"

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

func (s *FriendService) SendFriendRequest(userID int, friendEmail string) error {
	friend, err := s.UserRepo.FindByEmail(friendEmail)
	if err != nil {
		return err
	}
	return s.Repo.SendFriendRequest(uint(userID), friend.ID)
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

func (s *FriendService) ShareCharacter(friendID int, characterID int) error {
	return s.Repo.ShareCharacter(uint(characterID), uint(friendID))
}

func (s *FriendService) UnshareCharacter(friendID int, characterID int) error {
	return s.Repo.UnshareCharacter(uint(characterID), uint(friendID))
}
