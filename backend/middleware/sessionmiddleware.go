package middleware

import (
	"github.com/gin-gonic/gin"

	"DnDCharacterSheet/utility"
)

func AuthMiddleware(s utility.SessionManager) gin.HandlerFunc {
	return s.AuthenticateSession
}
