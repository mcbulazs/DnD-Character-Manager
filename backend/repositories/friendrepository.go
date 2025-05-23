package repositories

import (
	"strings"

	"gorm.io/gorm"

	"DnDCharacterSheet/models"
)

type FriendRepository struct {
	DB *gorm.DB
}

func NewFriendRepository(db *gorm.DB) *FriendRepository {
	return &FriendRepository{DB: db}
}

func (r *FriendRepository) GetUserFriend(userId uint, friendId uint) (*models.FriendsModel, error) {
	var Friend models.FriendsModel
	tx := r.DB.Model(&models.FriendsModel{}).
		Preload("Friend").
		First(&Friend, "user_id = ? AND friend_id = ?", userId, friendId)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &Friend, nil
}

func (r *FriendRepository) AcceptFriendRequest(friendRequestId uint, userId uint) (error, *models.FriendRequestModel) {
	tx := r.DB.Begin()
	var friendRequest models.FriendRequestModel
	rx := tx.Model(&friendRequest).
		Preload("SourceUser").
		Preload("DestinationUser").
		Where("id = ? AND destination_user_id = ?", friendRequestId, userId).
		Update("status", models.FriendRequestsStatusEnum.Accepted).
		Find(&friendRequest)
	if rx.Error != nil {
		tx.Rollback()
		return rx.Error, nil
	}
	if rx.RowsAffected == 0 {
		return gorm.ErrRecordNotFound, nil
	}

	err := tx.Model(&models.FriendsModel{}).
		Create(&models.FriendsModel{
			User:   friendRequest.SourceUser,
			Friend: friendRequest.DestinationUser,
		}).Error
	if err != nil {
		tx.Rollback()
		return err, nil
	}
	err = tx.Model(&models.FriendsModel{}).
		Create(&models.FriendsModel{
			User:   friendRequest.DestinationUser,
			Friend: friendRequest.SourceUser,
		}).Error
	if err != nil {
		tx.Rollback()
		return err, nil
	}
	tx.Commit()
	return nil, &friendRequest
}

func (r *FriendRepository) DeclineFriendRequest(friendRequestId uint, userId uint) (error, *models.FriendRequestModel) {
	var request models.FriendRequestModel
	tx := r.DB.Model(&request).
		Preload("SourceUser").
		Preload("DestinationUser").
		Where("id = ? AND destination_user_id = ?", friendRequestId, userId).
		Update("status", models.FriendRequestsStatusEnum.Declined).
		Find(&request)
	if tx.Error != nil {
		return tx.Error, nil
	}
	if tx.RowsAffected == 0 {
		return gorm.ErrRecordNotFound, nil
	}
	return nil, &request
}

func (r *FriendRepository) SendFriendRequest(sourceUserId uint, destinationUserId uint) error {
	tx := r.DB.Create(&models.FriendRequestModel{
		SourceUserID:      sourceUserId,
		DestinationUserID: destinationUserId,
		Status:            models.FriendRequestsStatusEnum.Pending,
	})
	if tx.Error != nil {
		if strings.Contains(tx.Error.Error(), "UNIQUE constraint failed") {
			return gorm.ErrRecordNotFound
		}
		return tx.Error
	}
	return nil
}

func (r *FriendRepository) Unfriend(userId uint, friendId uint) error {
	tx := r.DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	rx := tx.Where("user_id = ? AND friend_id = ?", userId, friendId).Delete(&models.FriendsModel{})
	if rx.Error != nil {
		tx.Rollback()
		return rx.Error
	}
	if rx.RowsAffected == 0 {
		tx.Rollback()
		return gorm.ErrRecordNotFound
	}
	rx = tx.Where("user_id = ? AND friend_id = ?", friendId, userId).Delete(&models.FriendsModel{})
	if rx.Error != nil {
		tx.Rollback()
		return rx.Error
	}
	if rx.RowsAffected == 0 {
		tx.Rollback()
		return gorm.ErrRecordNotFound
	}
	tx.Commit()
	return nil
}

func (r *FriendRepository) UpdateName(userId int, friendId int, name string) error {
	tx := r.DB.Model(&models.FriendsModel{}).Where("user_id = ? AND friend_id = ?", userId, friendId).Update("name", name)
	if tx.Error != nil {
		return tx.Error
	}
	if tx.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *FriendRepository) ShareCharacter(characterId uint, friendId uint) error {
	var friendModel models.FriendsModel
	friendModel.ID = friendId
	var character models.CharacterModel
	character.ID = characterId
	tx := r.DB.Model(&friendModel).Association("SharedCharacters").Append(&character)
	if tx != nil {
		return tx
	}
	return nil
}

func (r *FriendRepository) UnshareCharacter(characterId uint, friendId uint) error {
	var friendModel models.FriendsModel
	friendModel.ID = friendId
	var character models.CharacterModel
	character.ID = characterId

	tx := r.DB.Model(&character).Association("SharedWith").Delete(&friendModel)
	if tx != nil {
		return tx
	}
	return nil
}

func (r *FriendRepository) FindByUserIDAndFriendID(userID uint, friendID uint) ([]models.CharacterModel, error) {
	FriendModel, err := r.GetUserFriend(userID, friendID)
	if err != nil {
		return nil, err
	}
	var characters []models.CharacterModel
	err = r.DB.
		Model(&models.CharacterModel{}).
		Preload("Image").
		Joins("JOIN friend_shares ON friend_shares.character_id = characters.id").
		Where("friend_shares.friend_id = ?", FriendModel.ID).
		Find(&characters).Error
	if err != nil {
		return nil, err
	}
	return characters, nil
}
