package utility

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"

	"DnDCharacterSheet/env"
)

type SessionManager interface {
	CreateSession(c *gin.Context, userID int) error
	ClearSession(c *gin.Context)
	GetUserIdBySession(c *gin.Context) int
	SetUserAuthentication(c *gin.Context)
	AuthenticateSession(c *gin.Context)
}

type GorillaSessionManager struct {
	store *sessions.CookieStore
}

func NewGorillaSessionManager() *GorillaSessionManager {
	return &GorillaSessionManager{
		store: sessions.NewCookieStore([]byte(env.GetStoreHash())),
	}
}

func (r *GorillaSessionManager) CreateSession(c *gin.Context, userID int) error {
	session := sessions.NewSession(r.store, "session")
	session.Values["user_id"] = userID
	session.Options = &sessions.Options{
		Path:     "/",
		HttpOnly: true,
		MaxAge:   60 * 60 * 24, // 1 day
		Secure:   c.Request.URL.Scheme == "https",
	}
	err := session.Save(c.Request, c.Writer)
	if err != nil {
		return err
	}
	return nil
}

func (r *GorillaSessionManager) ClearSession(c *gin.Context) {
	session, err := r.store.Get(c.Request, "session")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get session"})
		return
	}
	session.Options.MaxAge = -1 // Expire the session
	err = session.Save(c.Request, c.Writer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear session"})
		return
	}
}

func (r *GorillaSessionManager) GetUserIdBySession(c *gin.Context) int {
	session := c.MustGet("session").(*sessions.Session)
	userId := session.Values["user_id"]
	if userId == nil {
		return -1
	}
	return userId.(int)
}

func (r *GorillaSessionManager) SetUserAuthentication(c *gin.Context) {
	session, err := r.store.Get(c.Request, "session")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get session"})
		c.Abort()
		return
	}
	user_id, ok := session.Values["user_id"].(int)
	if ok && user_id != 0 {
		c.JSON(http.StatusOK, gin.H{"authenticated": true})
		return
	}
	c.JSON(http.StatusOK, gin.H{"authenticated": false})
}

func (r *GorillaSessionManager) AuthenticateSession(c *gin.Context) {
	session, err := r.store.Get(c.Request, "session")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get session"})
		c.Abort()
		return
	}

	user_id, ok := session.Values["user_id"].(int)
	if !ok || user_id == 0 {
		// User is not logged in
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		c.Abort()
		return
	}

	c.Set("user_id", user_id)
	c.Set("session", session)
	c.Next()
}
