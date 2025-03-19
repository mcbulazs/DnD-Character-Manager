package repositories

import (
	"errors"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"DnDCharacterSheet/models"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

var ErrUserNotFound = errors.New("user not found")

func (r *UserRepository) Create(user *models.UserModel) error {
	tx := r.DB.Create(user)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *UserRepository) FindByID(id int) (*models.UserModel, error) {
	var foundUser models.UserModel
	tx := r.DB.Preload("Friends").First(&foundUser, id)
	if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		return nil, ErrUserNotFound
	}
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &foundUser, nil
}

func (r *UserRepository) FindByEmail(email string) (*models.UserModel, error) {
	var foundUser models.UserModel
	tx := r.DB.First(&foundUser, "email = ?", email)
	if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		return nil, ErrUserNotFound
	}
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &foundUser, nil
}

func (r *UserRepository) AcceptFriendRequest(friendRequestId uint, userId uint) error {
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

func (r *UserRepository) DeclineFriendRequest(friendRequestId uint, userId uint) error {
	tx := r.DB.Model(&models.FriendRequest{}).Where("id = ? AND destination_user_id = ?", friendRequestId, userId).Update("status", models.FriendRequestsStatusEnum.Declined)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (r *UserRepository) SendFriendRequest(sourceUserId uint, destinationUserId uint) error {
	tx := r.DB.Create(&models.FriendRequest{SourceUserId: sourceUserId, DestinationUserId: destinationUserId, Status: models.FriendRequestsStatusEnum.Pending})
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}
