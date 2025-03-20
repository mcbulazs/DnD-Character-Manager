package models

import (
	"gorm.io/gorm"
)

type UserModel struct {
	gorm.Model
	Password         string
	Email            string                `gorm:"unique"`
	Characters       []CharacterModel      `gorm:"foreignKey:UserID"`
	Friends          []*FriendsModel       `gorm:"foreignKey:UserID"`
	FriendedBy       []*FriendsModel       `gorm:"foreignKey:FriendID"`
	FriendRequests   []*FriendRequestModel `gorm:"foreignKey:SourceUserID"`
	FriendRequestsBy []*FriendRequestModel `gorm:"foreignKey:DestinationUserID"`
	SharedCharacters []*CharacterModel     `gorm:"many2many:friend_shares;joinForeignKey:FriendID;joinReferences:CharacterID"`
}

func (u *UserModel) TableName() string {
	return "users"
}
