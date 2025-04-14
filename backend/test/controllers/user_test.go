package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"DnDCharacterSheet/controllers"
	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/services"
	"DnDCharacterSheet/test/helpers"
)

type MockSessionManager struct {
	UserID int
	err    error
}

func (m *MockSessionManager) CreateSession(c *gin.Context, userID int) error {
	if m.err != nil {
		return m.err
	}
	m.UserID = userID
	return nil
}

func (m *MockSessionManager) ClearSession(c *gin.Context) {
	m.UserID = 0
}

func (m *MockSessionManager) GetUserIdBySession(c *gin.Context) int {
	return m.UserID
}

func (m *MockSessionManager) GetUserAuthentication(c *gin.Context) {
	// Mock implementation, do nothing
}

func (m *MockSessionManager) AuthenticateSession(c *gin.Context) {
	// Mock implementation, do nothing
}

type mockUserService struct {
	err error
}

func (m *mockUserService) GetUserByID(userID int) (*dto.UserDataDTO, error) {
	if m.err != nil {
		return nil, m.err
	}
	return &dto.UserDataDTO{ID: uint(userID), Email: "test@example.com"}, nil
}

func (m *mockUserService) AuthenticateUser(user *dto.AuthUserDTO) (int, error) {
	// Mock implementation, return a dummy user ID
	if m.err != nil {
		return -1, m.err
	}
	return 1, nil
}

func (m *mockUserService) CreateUser(user *dto.AuthUserDTO) (*models.UserModel, error) {
	// Mock implementation, return a dummy user
	if m.err != nil {
		return nil, m.err
	}
	model := &models.UserModel{Email: user.Email}
	model.ID = 1
	return model, nil
}

func TestUserController_GetUserDataHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("Successful fetch", func(t *testing.T) {
		mockSession := &MockSessionManager{UserID: 1}
		userController := &controllers.UserController{
			Service:        &mockUserService{},
			SessionManager: mockSession,
		}
		// Create request and response recorder
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		// Important: set "session" in context to simulate a valid request
		c.Set("session", nil) // session itself isn't used in this mock
		c.Request, _ = http.NewRequest(http.MethodGet, "/user", nil)

		// Call the handler
		userController.GetUserDataHandler(c)

		// Validate response
		assert.Equal(t, http.StatusOK, w.Code)

		// Decode the response body
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)

		// Validate fields
		assert.Equal(t, response["email"], "test@example.com")

		assert.Equal(t, response["id"], float64(1)) // JSON numbers are float64
	})

	t.Run("User service returns error", func(t *testing.T) {
		mockSession := &MockSessionManager{UserID: 1}
		userController := &controllers.UserController{
			Service:        &mockUserService{err: errors.New("test error")},
			SessionManager: mockSession,
		}
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Set("session", nil)
		c.Request, _ = http.NewRequest(http.MethodGet, "/user", nil)

		// Call the handler again with error
		userController.GetUserDataHandler(c)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
	})
}

func TestUserController_RegisterHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("Successful registration", func(t *testing.T) {
		mockSession := &MockSessionManager{}
		userController := &controllers.UserController{
			Service:        &mockUserService{},
			SessionManager: mockSession,
		}

		body := `{"email":"newuser@example.com","password":"securepass"}`
		req, _ := http.NewRequest(http.MethodPost, "/register", helpers.JsonBody(body))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		userController.RegisterHandler(c)

		assert.Equal(t, http.StatusCreated, w.Code)
	})

	t.Run("Invalid request body", func(t *testing.T) {
		mockSession := &MockSessionManager{}
		userController := &controllers.UserController{
			Service:        &mockUserService{},
			SessionManager: mockSession,
		}

		req, _ := http.NewRequest(http.MethodPost, "/register", helpers.JsonBody(`invalid json`))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		userController.RegisterHandler(c)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("User service returns general error", func(t *testing.T) {
		mockSession := &MockSessionManager{}
		userController := &controllers.UserController{
			Service:        &mockUserService{err: errors.New("creation error")},
			SessionManager: mockSession,
		}

		body := `{"email":"fail@example.com","password":"securepass"}`
		req, _ := http.NewRequest(http.MethodPost, "/register", helpers.JsonBody(body))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		userController.RegisterHandler(c)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
	})

	t.Run("User service returns duplicate key error", func(t *testing.T) {
		mockSession := &MockSessionManager{}
		userController := &controllers.UserController{
			Service:        &mockUserService{err: gorm.ErrDuplicatedKey},
			SessionManager: mockSession,
		}

		body := `{"email":"fail@example.com","password":"securepass"}`
		req, _ := http.NewRequest(http.MethodPost, "/register", helpers.JsonBody(body))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		userController.RegisterHandler(c)

		assert.Equal(t, http.StatusConflict, w.Code)
	})

	t.Run("session returns error", func(t *testing.T) {
		mockSession := &MockSessionManager{err: errors.New("session error")}
		userController := &controllers.UserController{
			Service:        &mockUserService{},
			SessionManager: mockSession,
		}

		body := `{"email":"fail@example.com","password":"securepass"}`
		req, _ := http.NewRequest(http.MethodPost, "/register", helpers.JsonBody(body))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		userController.RegisterHandler(c)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
	})
}

func TestUserController_LoginHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("Successful login", func(t *testing.T) {
		mockSession := &MockSessionManager{}
		userController := &controllers.UserController{
			Service:        &mockUserService{},
			SessionManager: mockSession,
		}

		body := `{"email":"test@example.com","password":"securepass"}`
		req, _ := http.NewRequest(http.MethodPost, "/login", helpers.JsonBody(body))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		userController.LoginHandler(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, 1, mockSession.UserID)
	})

	t.Run("Invalid JSON request", func(t *testing.T) {
		mockSession := &MockSessionManager{}
		userController := &controllers.UserController{
			Service:        &mockUserService{},
			SessionManager: mockSession,
		}

		req, _ := http.NewRequest(http.MethodPost, "/login", helpers.JsonBody(`invalid json`))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		userController.LoginHandler(c)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("User service returns general error", func(t *testing.T) {
		mockSession := &MockSessionManager{}
		userController := &controllers.UserController{
			Service:        &mockUserService{err: errors.New("login error")},
			SessionManager: mockSession,
		}

		body := `{"email":"fail@example.com","password":"wrongpass"}`
		req, _ := http.NewRequest(http.MethodPost, "/login", helpers.JsonBody(body))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		userController.LoginHandler(c)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
	})

	t.Run("Authentication fails", func(t *testing.T) {
		mockSession := &MockSessionManager{}
		userController := &controllers.UserController{
			Service:        &mockUserService{err: services.ErrAuthenticationFailed},
			SessionManager: mockSession,
		}

		body := `{"email":"fail@example.com","password":"wrongpass"}`
		req, _ := http.NewRequest(http.MethodPost, "/login", helpers.JsonBody(body))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		userController.LoginHandler(c)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("Session creation fails", func(t *testing.T) {
		mockSession := &MockSessionManager{err: errors.New("session error")}
		userController := &controllers.UserController{
			Service:        &mockUserService{},
			SessionManager: mockSession,
		}

		body := `{"email":"test@example.com","password":"securepass"}`
		req, _ := http.NewRequest(http.MethodPost, "/login", helpers.JsonBody(body))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = req

		userController.LoginHandler(c)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
	})
}
