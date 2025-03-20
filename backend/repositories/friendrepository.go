package repositories

import (
	"errors"

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
	Friend.ID = friendRequest.DestinationUserId
	var User models.UserModel
	User.ID = friendRequest.SourceUserId
	err = tx.Model(&User).Association("Friends").Append(&Friend)
	if err != nil {
		tx.Rollback()
		return err
	}
	err = tx.Model(&Friend).Association("Friends").Append(&User)
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
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
	tx := r.DB.Create(&models.FriendRequestModel{SourceUserId: sourceUserId, DestinationUserId: destinationUserId, Status: models.FriendRequestsStatusEnum.Pending})
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
