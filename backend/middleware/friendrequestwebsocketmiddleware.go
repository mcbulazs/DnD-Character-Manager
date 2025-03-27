package middleware

import (
	"strconv"

	"github.com/gin-gonic/gin"

	"DnDCharacterSheet/websocket"
)

func FriendRequestWebsocketMiddleware(c *gin.Context) {
	// Run the main handler first
	c.Next()

	// Check if the request method is POST, PUT, or PATCH
	friendId := c.MustGet("friend_id").(uint)
	Id := strconv.FormatUint(uint64(friendId), 10)
	objectID := "/friendRequest/" + Id
	websocket.Broadcast([]byte("friendRequest"), objectID)
}
