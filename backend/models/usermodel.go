package models

import (
	"gorm.io/gorm"
)

type UserModel struct {
	gorm.Model
	Email          string `gorm:"unique"`
	Password       string
	Characters     []CharacterModel `gorm:"foreignKey:UserID"`
	Friends        []*UserModel     `gorm:"many2many:friends;joinForeignKey:UserID;joinReferences:FriendID"` // foreignKey:UserID"`
	FriendRequests []*FriendRequest `gorm:"many2many:friend_requests;joinForeignKey:SourceUserId;joinReferences:DestinationUserId"`
}

func (u *UserModel) TableName() string {
	return "users"
}
