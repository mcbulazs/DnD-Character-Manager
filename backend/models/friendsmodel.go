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
	SourceUserId      uint
	DestinationUserId uint
	Status            FriendRequestStatus
}

func (f *FriendRequestModel) TableName() string {
	return "friend_requests"
}

type FriendsModel struct {
	gorm.Model
	UserID   uint `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
	FriendID uint `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
	Note     string
	Name     string
}

func (f *FriendsModel) TableName() string {
	return "friends"
}

type FriendShareModel struct {
	gorm.Model
	CharacterID uint `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
	FriendID    uint `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
}

func (f *FriendShareModel) TableName() string {
	return "friend_shares"
}
