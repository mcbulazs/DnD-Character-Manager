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

type FriendRequest struct {
	gorm.Model
	SourceUserId      uint
	DestinationUserId uint
	Status            FriendRequestStatus
}

func (f *FriendRequest) TableName() string {
	return "friend_requests"
}

type Friends struct {
	gorm.Model
	UserID   uint `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
	FriendID uint `gorm:"index:,unique,composite:uidx,where delete_at IS NULL"`
	Note     string
	Name     string
}

func (f *Friends) TableName() string {
	return "friends"
}
