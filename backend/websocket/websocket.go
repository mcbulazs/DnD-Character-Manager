package websocket

import (
	"net/http"
	"slices"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	"DnDCharacterSheet/env"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")

		// Allow empty origin (non-browser clients)
		if origin == "" {
			return true
		}

		// Case-insensitive comparison
		origin = strings.ToLower(origin)
		allowed := slices.ContainsFunc(env.AllowedOrigins(), func(allowed string) bool {
			return strings.EqualFold(allowed, origin)
		})
		return allowed
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 1024
)

type ClientManager struct {
	subscriptions map[string][]*websocket.Conn
	mutex         sync.RWMutex
}

var store = ClientManager{
	subscriptions: make(map[string][]*websocket.Conn),
}

func HandleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}

	objectID := c.Param("Id")
	if objectID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No object ID provided"})
		return
	}
	addClient(conn, objectID)

	conn.SetReadLimit(maxMessageSize)
	conn.SetReadDeadline(time.Now().Add(pongWait))
	conn.SetPongHandler(func(string) error {
		conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	// Start reader goroutine
	go readPump(conn, objectID)
}

func addClient(conn *websocket.Conn, objectID string) {
	store.mutex.Lock()
	defer store.mutex.Unlock()
	store.subscriptions[objectID] = append(store.subscriptions[objectID], conn)
}

// RemoveClient removes a WebSocket client
func removeClient(conn *websocket.Conn, objectID string) {
	store.mutex.Lock()
	defer store.mutex.Unlock()

	conn.Close()

	if clients, ok := store.subscriptions[objectID]; ok {
		for i, client := range clients {
			if client == conn {
				// Remove the client from the list
				store.subscriptions[objectID] = append(clients[:i], clients[i+1:]...)
				break
			}
		}
	}

	if len(store.subscriptions[objectID]) == 0 {
		delete(store.subscriptions, objectID)
	}
}

func WriteMessage(conn *websocket.Conn, message []byte) error {
	conn.SetWriteDeadline(time.Now().Add(writeWait))
	return conn.WriteMessage(websocket.TextMessage, message)
}

func Broadcast(message []byte, objectID string) error {
	store.mutex.RLock()
	defer store.mutex.RUnlock()

	clients, ok := store.subscriptions[objectID]

	if !ok {
		return nil
	}

	for _, client := range clients {
		if e := WriteMessage(client, message); e != nil {
			go removeClient(client, objectID)
		}
	}
	return nil
}

func readPump(conn *websocket.Conn, objectID string) {
	defer removeClient(conn, objectID)

	ticker := time.NewTicker(pingPeriod)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		default:
			_, message, err := conn.ReadMessage()
			Broadcast(message, objectID)
			if err != nil {
				return
			}
		}
	}
}
