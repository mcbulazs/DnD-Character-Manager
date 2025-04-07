package middleware

import (
	"github.com/gin-gonic/gin"
)

func OptionsMidddleware(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Methods", getAllowedMethods(c.FullPath()))
	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(200)
		return
	}
	c.Next()
}

func getAllowedMethods(route string) string {
	switch route {
	case "/api/register":
		return "POST, OPTIONS"
	case "/api/login":
		return "POST, OPTIONS"
	case "/api/auth":
		return "GET, OPTIONS"
	case "/api/logout":
		return "POST, OPTIONS"
	case "/api/user":
		return "GET, OPTIONS"
	case "/api/characters":
		return "POST, GET, OPTIONS"
	case "/api/characters/:characterId":
		return "GET, OPTIONS"
	case "/api/characters/:characterId/ability-scores":
		return "PUT, OPTIONS"
	case "/api/characters/:characterId/skills":
		return "PUT, OPTIONS"
	case "/api/characters/characterId/saving-throws":
		return "PUT, OPTIONS"
	case "/api/characters/characterId/image":
		return "PUT, OPTIONS"
	case "/api/characters/characterId/attributes":
		return "PATCH, OPTIONS"
	case "/api/characters/characterId/features":
		return "GET, POST, OPTIONS"
	case "/api/characters/options":
		return "PUT, OPTIONS"
	case "/api/characters/characterId/features/:featureId":
		return "PUT, DELTE, OPTIONS"
	case "/api/characters/characterId/spells":
		return "POST, OPTIONS"
	case "/api/characters/characterId/spells/:spellId":
		return "PUT, DELETE, OPTIONS"
	case "/api/characters/:characterId/trackers":
		return "POST, OPTIONS"
	case "/api/characters/:characterId/trackers/order":
		return "PATCH, OPTIONS"
	case "/api/characters/:characterId/trackers/:trackerId":
		return "PUT, DELETE, OPTIONS"
	case "/api/characters/:characterId/notes":
		return "POST, OPTIONS"
	case "/api/characters/:characterId/notes/:noteId":
		return "PUT, DELETE, OPTIONS"

	default:
		return "GET, OPTIONS"
	}
}
