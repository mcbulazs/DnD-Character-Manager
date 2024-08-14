package middleware

import (
	"DnDCharacterSheet/utility"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return utility.AuthenticateSession
}
