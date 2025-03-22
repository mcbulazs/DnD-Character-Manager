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
	return s.Repo.IsUserFriend(uint(userID), uint(friendID))
}

func (s *FriendService) SendFriendRequest(userID int, friendEmail string) error {
	friend, err := s.UserRepo.FindByEmail(friendEmail)
	if err != nil {
		return err
	}
	if s.IsUserFriend(userID, int(friend.ID)) {
		return gorm.ErrCheckConstraintViolated
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

func (s *FriendService) FindByUserIDAndFriendID(userID uint, friendID uint) ([]dto.CharacterBaseDTO, error) {
	characterShares, err := s.Repo.FindByUserIDAndFriendID(userID, friendID)
	if err != nil {
		return nil, err
	}
	var characters []dto.CharacterBaseDTO
	for _, share := range characterShares {
		characters = append(characters, *convertToCharacterBaseDTO(&share.Character))
	}
	return characters, nil
}
