package repositories

import (
	"strings"

	"gorm.io/gorm"

	"DnDCharacterSheet/models"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) Create(user *models.UserModel) error {
	tx := r.DB.Create(user)
	if tx.Error != nil {
		if strings.Contains(tx.Error.Error(), "UNIQUE constraint failed") {
			return gorm.ErrDuplicatedKey
		}
		return tx.Error
	}
	return nil
}

func (r *UserRepository) FindByID(id int) (*models.UserModel, error) {
	var foundUser models.UserModel
	tx := r.DB.
		Preload("FriendRequestsBy.SourceUser").
		Preload("FriendRequestsBy", "status = ?", models.FriendRequestsStatusEnum.Pending).
		Preload("Friends.Friend").
		Preload("Friends").
		Preload("Characters").
		Preload("Characters.Image").
		First(&foundUser, id)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &foundUser, nil
}

func (r *UserRepository) FindByEmail(email string) (*models.UserModel, error) {
	var foundUser models.UserModel
	tx := r.DB.First(&foundUser, "email = ?", email)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &foundUser, nil
}
