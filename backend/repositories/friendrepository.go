package repositories

import (
	"errors"
	"fmt"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"DnDCharacterSheet/models"
)

type FriendRepository struct {
	DB *gorm.DB
}

func NewFriendRepository(db *gorm.DB) *FriendRepository {
	return &FriendRepository{DB: db}
}

func (r *FriendRepository) IsUserFriend(userId uint, friendId uint) bool {
	var Frend models.FriendsModel
	tx := r.DB.Model(&models.FriendsModel{}).First(&Frend, "user_id = ? AND friend_id = ?", userId, friendId)
	if tx.Error != nil || errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		return false
	}
	return true
}

func (r *FriendRepository) AcceptFriendRequest(friendRequestId uint, userId uint) error {
	tx := r.DB.Begin()
	var friendRequest models.FriendRequestModel
	err := tx.Model(&friendRequest).Clauses(clause.Returning{}).Where("id = ? AND destination_user_id = ?", friendRequestId, userId).Update("status", models.FriendRequestsStatusEnum.Accepted).Error
	if err != nil {
		tx.Rollback()
		return err
	}

	var Friend models.UserModel
	Friend.ID = friendRequest.DestinationUserID
	var User models.UserModel
	User.ID = friendRequest.SourceUserID
	err = tx.Model(&models.FriendsModel{}).Create(&models.FriendsModel{User: User, Friend: Friend}).Error
	if err != nil {
		fmt.Println("Error", err)
		tx.Rollback()
		return err
	}
	err = tx.Model(&models.FriendsModel{}).Create(&models.FriendsModel{User: Friend, Friend: User}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	fmt.Println("Friend request accepted")
	return nil
}

func (r *FriendRepository) DeclineFriendRequest(friendRequestId uint, userId uint) error {
	tx := r.DB.Model(&models.FriendRequestModel{}).Where("id = ? AND destination_user_id = ?", friendRequestId, userId).Update("status", models.FriendRequestsStatusEnum.Declined)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *FriendRepository) SendFriendRequest(sourceUserId uint, destinationUserId uint) error {
	tx := r.DB.Create(&models.FriendRequestModel{SourceUserID: sourceUserId, DestinationUserID: destinationUserId, Status: models.FriendRequestsStatusEnum.Pending})
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *FriendRepository) Unfriend(userId uint, friendId uint) error {
	tx := r.DB.Where("user_id = ? AND friend_id = ?", userId, friendId).Delete(&models.FriendsModel{})
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *FriendRepository) UpdateName(userId int, friendId int, name string) error {
	tx := r.DB.Model(&models.FriendsModel{}).Where("user_id = ? AND friend_id = ?", userId, friendId).Update("name", name)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *FriendRepository) ShareCharacter(characterId uint, friendId uint) error {
	tx := r.DB.Create(&models.FriendShareModel{CharacterID: characterId, FriendID: friendId})
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *FriendRepository) UnshareCharacter(characterId uint, friendId uint) error {
	tx := r.DB.Where("character_id = ? AND friend_id = ?", characterId, friendId).Delete(&models.FriendShareModel{})
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *FriendRepository) FindByUserIDAndFriendID(userID uint, friendID uint) ([]models.FriendShareModel, error) {
	var characters []models.FriendShareModel
	err := r.DB.
		Joins("JOIN characters ON characters.id = friend_shares.character_id").
		Joins("JOIN character_images ON character_images.character_id = characters.id").
		Preload("Character").
		Preload("Character.Image").
		Where("friend_id = ? AND characters.user_id = ?", friendID, userID).
		Find(&characters).
		Error
	if err != nil {
		return nil, err
	}
	return characters, nil
}
