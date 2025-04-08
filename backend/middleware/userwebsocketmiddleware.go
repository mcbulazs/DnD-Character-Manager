package middleware

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"

	"DnDCharacterSheet/websocket"
)

func UserWebsocketMiddleware(c *gin.Context) {
	// Run the main handler first
	c.Next()
	friendId := c.MustGet("friend_id").(uint)
	fmt.Println("friendId", friendId)
	websocketMessage, _ := c.Get("websocket_message")
	Id := strconv.FormatUint(uint64(friendId), 10)
	objectID := "/users/" + Id
	websocket.Broadcast([]byte(websocketMessage.(string)), objectID)
}
