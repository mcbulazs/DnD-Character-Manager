package middleware

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"DnDCharacterSheet/websocket"
)

func CharacterWebsocketMiddleware(c *gin.Context) {
	// Run the main handler first
	c.Next()

	// Check if the request method is POST, PUT, or PATCH
	if c.Request.Method == http.MethodPost ||
		c.Request.Method == http.MethodDelete ||
		c.Request.Method == http.MethodPut ||
		c.Request.Method == http.MethodPatch {
		// Broadcast a message to all WebSocket clients
		characterId := c.MustGet("character_id").(int)
		Id := strconv.Itoa(characterId)
		objectID := "/characters/" + Id
		websocket.Broadcast([]byte("character"), objectID)
	}
}
