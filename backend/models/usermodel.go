package models

import (
	"gorm.io/gorm"
)

type UserModel struct {
	gorm.Model
	Email            string `gorm:"unique"`
	Password         string
	Characters       []CharacterModel      `gorm:"foreignKey:UserID"`
	Friends          []*UserModel          `gorm:"many2many:friends;joinForeignKey:UserID;joinReferences:FriendID"` // foreignKey:UserID"`
	FriendRequests   []*FriendRequestModel `gorm:"many2many:friend_requests;joinForeignKey:SourceUserId;joinReferences:DestinationUserId"`
	SharedCharacters []*CharacterModel     `gorm:"many2many:friend_shares;joinForeignKey:FriendID;joinReferences:CharacterID"`
}

func (u *UserModel) TableName() string {
	return "users"
}
