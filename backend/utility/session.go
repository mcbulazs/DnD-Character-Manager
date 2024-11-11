package utility

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"

	"DnDCharacterSheet/env"
)

var store = sessions.NewCookieStore([]byte(env.GetStoreHash()))

// CreateSession creates a new session
func CreateSession(c *gin.Context, user_id int) error {
	session := sessions.NewSession(store, "session")
	session.Values["user_id"] = user_id
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

// ClearSession clears the session
func ClearSession(c *gin.Context) {
	session, err := store.Get(c.Request, "session")
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

// GetUserIdBySession returns the user ID stored in the session
func GetUserIdBySession(c *gin.Context) (int, error) {
	session := c.MustGet("session").(*sessions.Session)
	userId := session.Values["user_id"]
	if userId == nil {
		return 0, nil
	}
	return userId.(int), nil
}

func SetUserAuthentication(c *gin.Context) {
	session, err := store.Get(c.Request, "session")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get session"})
		c.Abort()
	}
	user_id, ok := session.Values["user_id"].(int)
	if ok && user_id != 0 {
		c.JSON(http.StatusOK, gin.H{"authenticated": true})
		return
	}
	c.JSON(http.StatusOK, gin.H{"authenticated": false})
}

// AuthenticateSession checks if the user is authenticated
func AuthenticateSession(c *gin.Context) {
	session, err := store.Get(c.Request, "session")
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
