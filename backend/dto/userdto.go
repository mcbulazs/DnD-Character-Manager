package dto

type AuthUserDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UserDataDTO struct {
	ID             uint               `json:"id"`
	Email          string             `json:"email"`
	Characters     []CharacterBaseDTO `json:"characters"`
	Friends        []FriendDTO        `json:"friends"`
	FriendRequests []FriendRequestDTO `json:"friendRequests"`
}

type FriendDTO struct {
	Friend UserDataDTO `json:"friend"`
	Name   string      `json:"name"`
	Note   string      `json:"note"`
}

type FriendRequestDTO struct {
	ID     uint        `json:"id"`
	Sender UserDataDTO `json:"sender"`
}
