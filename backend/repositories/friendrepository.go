package repositories

import (
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

func (r *FriendRepository) AcceptFriendRequest(friendRequestId uint, userId uint) error {
	tx := r.DB.Begin()
	var friendRequest models.FriendRequest
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
	tx := r.DB.Model(&models.FriendRequest{}).Where("id = ? AND destination_user_id = ?", friendRequestId, userId).Update("status", models.FriendRequestsStatusEnum.Declined)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *FriendRepository) SendFriendRequest(sourceUserId uint, destinationUserId uint) error {
	tx := r.DB.Create(&models.FriendRequest{SourceUserId: sourceUserId, DestinationUserId: destinationUserId, Status: models.FriendRequestsStatusEnum.Pending})
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}
