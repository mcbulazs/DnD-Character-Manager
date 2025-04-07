package models

import "gorm.io/gorm"

type FriendRequestStatus string

type FriendRequestStatusEnumStruct struct {
	Pending  FriendRequestStatus
	Accepted FriendRequestStatus
	Declined FriendRequestStatus
}

var FriendRequestsStatusEnum = FriendRequestStatusEnumStruct{
	Pending:  "PENDING",
	Accepted: "ACCEPTED",
	Declined: "DECLINED",
}

type FriendRequestModel struct {
	gorm.Model
	SourceUserID      uint      `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
	SourceUser        UserModel `gorm:"foreignKey:SourceUserID"`
	DestinationUserID uint      `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
	DestinationUser   UserModel `gorm:"foreignKey:DestinationUserID"`
	Status            FriendRequestStatus
}

func (f *FriendRequestModel) TableName() string {
	return "friend_requests"
}

type FriendsModel struct {
	gorm.Model
	UserID           uint              `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
	User             UserModel         `gorm:"foreignKey:UserID"`
	FriendID         uint              `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
	Friend           UserModel         `gorm:"foreignKey:FriendID"`
	SharedCharacters []*CharacterModel `gorm:"many2many:friend_shares;joinForeignKey:FriendID;joinReferences:CharacterID"`
	Note             string
	Name             string
}

func (f *FriendsModel) TableName() string {
	return "friends"
}

/*
type FriendShareModel struct {
	gorm.Model
	Character   CharacterModel `gorm:"foreignKey:CharacterID"`
	CharacterID uint           `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
	Friend      FriendsModel   `gorm:"foreignKey:FriendID"`
	FriendID    uint           `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
}

func (f *FriendShareModel) TableName() string {
	return "friend_shares"
}*/
