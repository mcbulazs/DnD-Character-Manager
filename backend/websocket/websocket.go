package websocket

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections (for development only)
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type ClientManager struct {
	subscriptions map[string][]*websocket.Conn
	mutex         sync.Mutex
}

func NewClientManager() *ClientManager {
	return &ClientManager{
		subscriptions: make(map[string][]*websocket.Conn),
	}
}

func HandleWebSocket(c *gin.Context, cm *ClientManager) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}
	// defer conn.Close()

	Id := c.Param("Id")
	cm.AddClient(conn, Id)
}

func (cm *ClientManager) AddClient(conn *websocket.Conn, objectID string) {
	cm.mutex.Lock()
	defer cm.mutex.Unlock()
	cm.subscriptions[objectID] = append(cm.subscriptions["all"], conn)
}

// RemoveClient removes a WebSocket client
func (cm *ClientManager) RemoveClient(conn *websocket.Conn) {
	cm.mutex.Lock()
	defer cm.mutex.Unlock()

	for objectID, clients := range cm.subscriptions {
		for i, client := range clients {
			if client == conn {
				// Remove the client from the list
				cm.subscriptions[objectID] = append(clients[:i], clients[i+1:]...)
				break
			}
		}
	}
}

func (cm *ClientManager) Broadcast(objectID string, message string) {
	cm.mutex.Lock()
	defer cm.mutex.Unlock()
	if clients, ok := cm.subscriptions[objectID]; ok {
		for _, client := range clients {
			err := client.WriteMessage(websocket.TextMessage, []byte(message))
			if err != nil {
				client.Close()
				cm.RemoveClient(client) // Clean up disconnected clients
			}
		}
	}
}
