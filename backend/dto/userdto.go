package dto

type CreateUserDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UserDTO struct {
	Email   string    `json:"email"`
	Friends []UserDTO `json:"friends"`
}
