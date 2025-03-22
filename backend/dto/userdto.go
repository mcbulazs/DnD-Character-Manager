package dto

type AuthUserDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UserDataDTO struct {
	ID             uint               `json:"id"`
	Email          string             `json:"email"`
	Characters     []CharacterBaseDTO `json:"characters"`
	Friends        []UserDataDTO      `json:"friends"`
	FriendRequests []FriendRequestDTO `json:"friendRequests"`
}

type FriendRequestDTO struct {
	ID     uint        `json:"id"`
	Sender UserDataDTO `json:"sender"`
}
