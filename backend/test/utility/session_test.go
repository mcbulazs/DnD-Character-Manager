package utility

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"DnDCharacterSheet/utility"
)

func TestCreateSession(t *testing.T) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req, _ := http.NewRequest("GET", "/", nil)
	c.Request = req

	manager := utility.NewGorillaSessionManager()

	err := manager.CreateSession(c, 42)
	assert.NoError(t, err)

	// Check for Set-Cookie header
	cookies := w.Result().Cookies()
	var found bool
	for _, cookie := range cookies {
		if cookie.Name == "session" {
			found = true
			break
		}
	}
	assert.True(t, found, "Session cookie should be set")
}

func TestClearSession(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// First create session
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req, _ := http.NewRequest("GET", "/", nil)
	c.Request = req

	manager := utility.NewGorillaSessionManager()
	_ = manager.CreateSession(c, 42)

	// Now clear session
	w2 := httptest.NewRecorder()
	c2, _ := gin.CreateTestContext(w2)
	req2, _ := http.NewRequest("GET", "/", nil)
	// Use the same cookies
	for _, cookie := range w.Result().Cookies() {
		req2.AddCookie(cookie)
	}
	c2.Request = req2

	manager.ClearSession(c2)

	// Check if session is expired
	found := false
	for _, cookie := range w2.Result().Cookies() {
		if cookie.Name == "session" && cookie.MaxAge < 0 {
			found = true
		}
	}
	assert.True(t, found, "Session should be expired after ClearSession")
}

func TestGetUserIdBySession(t *testing.T) {
	gin.SetMode(gin.TestMode)

	manager := utility.NewGorillaSessionManager()
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req, _ := http.NewRequest("GET", "/", nil)
	c.Request = req
	// Create session with user ID
	_ = manager.CreateSession(c, 42)
	// Use session in second context
	w2 := httptest.NewRecorder()
	c2, _ := gin.CreateTestContext(w2)
	req2, _ := http.NewRequest("GET", "/", nil)
	for _, cookie := range w.Result().Cookies() {
		req2.AddCookie(cookie)
	}
	c2.Request = req2
	manager.AuthenticateSession(c2)
	userId := manager.GetUserIdBySession(c2)
	assert.Equal(t, 42, userId)
}

func TestGetUserAuthentication(t *testing.T) {
	gin.SetMode(gin.TestMode)

	manager := utility.NewGorillaSessionManager()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req, _ := http.NewRequest("GET", "/", nil)
	c.Request = req
	t.Run("user authenticated", func(t *testing.T) {
		_ = manager.CreateSession(c, 42)

		w2 := httptest.NewRecorder()
		c2, _ := gin.CreateTestContext(w2)
		req2, _ := http.NewRequest("GET", "/", nil)
		for _, cookie := range w.Result().Cookies() {
			req2.AddCookie(cookie)
		}
		c2.Request = req2

		manager.GetUserAuthentication(c2)

		assert.Equal(t, http.StatusOK, w2.Code)
		assert.Contains(t, w2.Body.String(), `"authenticated":true`)
	})
	t.Run("user not authenticated", func(t *testing.T) {
		manager.GetUserAuthentication(c)
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"authenticated":false`)
	})
}

func TestAuthenticateSession(t *testing.T) {
	gin.SetMode(gin.TestMode)

	manager := utility.NewGorillaSessionManager()

	// Set up context with authenticated session
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req, _ := http.NewRequest("GET", "/", nil)
	c.Request = req
	t.Run("CreateSession", func(t *testing.T) {
		_ = manager.CreateSession(c, 42)

		// Use session in second context
		w2 := httptest.NewRecorder()
		c2, _ := gin.CreateTestContext(w2)
		req2, _ := http.NewRequest("GET", "/", nil)
		for _, cookie := range w.Result().Cookies() {
			req2.AddCookie(cookie)
		}
		c2.Request = req2

		manager.AuthenticateSession(c2)
		assert.Equal(t, http.StatusOK, w2.Code)
	})

	t.Run("NoSession", func(t *testing.T) {
		// Create a new context without session
		w2 := httptest.NewRecorder()
		c2, _ := gin.CreateTestContext(w2)
		req2, _ := http.NewRequest("GET", "/", nil)
		c2.Request = req2
		manager.AuthenticateSession(c2)
		assert.Equal(t, http.StatusUnauthorized, w2.Code)
	})
}
