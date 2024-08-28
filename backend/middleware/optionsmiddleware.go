package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func OptionsMidddleware(c *gin.Context) {
	fmt.Println("Options Middleware")
	c.Writer.Header().Set("Access-Control-Allow-Methods", getAllowedMethods(c.FullPath()))
	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(200)
		return
	}
	c.Next()
}

func getAllowedMethods(route string) string {
	fmt.Println(route)
	switch route {
	case "/api/register":
		return "POST, OPTIONS"
	case "/api/login":
		return "POST, OPTIONS"
	case "/api/auth":
		return "GET, OPTIONS"
	case "/api/logout":
		return "POST, OPTIONS"
	case "/api/characters":
		return "POST, GET, OPTIONS"
	case "/api/characters/:id":
		return "GET, PUT, OPTIONS"
	case "/api/characters/favorite/:id":
		return "PATCH, OPTIONS"
	default:
		return "GET, OPTIONS"
	}
}
