package services_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"

	"DnDCharacterSheet/dto"
	"DnDCharacterSheet/models"
	"DnDCharacterSheet/services"
)

// MockRepository mocks the UserRepositoryInterface
type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) Create(user *models.UserModel) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockRepository) FindByID(id int) (*models.UserModel, error) {
	args := m.Called(id)
	if args.Error(1) != nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.UserModel), args.Error(1)
}

func (m *MockRepository) FindByEmail(email string) (*models.UserModel, error) {
	args := m.Called(email)
	if args.Error(1) != nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.UserModel), args.Error(1)
}

func TestUserService_CreateUser(t *testing.T) {
	mockRepo := new(MockRepository)
	userService := services.NewUserService(mockRepo)

	inputDTO := &dto.AuthUserDTO{
		Email:    "test@example.com",
		Password: "plaintextPassword",
	}
	callCount := 0
	mockRepo.On("Create", mock.MatchedBy(func(user *models.UserModel) bool {
		callCount++
		return callCount == 1
	})).Return(nil)
	mockRepo.On("Create", mock.MatchedBy(func(user *models.UserModel) bool {
		return callCount == 2
	})).Return(gorm.ErrDuplicatedKey)

	t.Run("CreateUser Success", func(t *testing.T) {
		createdUser1, err := userService.CreateUser(inputDTO)
		assert.NoError(t, err)
		assert.NotNil(t, createdUser1)
		assert.Equal(t, inputDTO.Email, createdUser1.Email)
		assert.NotEqual(t, "plaintextPassword", createdUser1.Password)
	})

	t.Run("CreateUser Duplicate Email", func(t *testing.T) {
		createdUser2, err := userService.CreateUser(inputDTO)
		assert.Error(t, err)
		assert.Nil(t, createdUser2)
		assert.Equal(t, err, gorm.ErrDuplicatedKey)
	})
	mockRepo.AssertExpectations(t)
}

func TestUserService_FindByID(t *testing.T) {
	mockRepo := new(MockRepository)
	userService := services.NewUserService(mockRepo)

	mockRepo.
		On("FindByID", 1).Return(&models.UserModel{
		Email:    "test@example.com",
		Password: "hashedPassword",
	}, nil).
		On("FindByID", 2).Return(nil, gorm.ErrRecordNotFound)

	t.Run("FindByID Success", func(t *testing.T) {
		user, err := userService.GetUserByID(1)
		assert.NoError(t, err)
		assert.NotNil(t, user)
		assert.Equal(t, user.Email, "test@example.com")
	})

	t.Run("FindByID Not Found", func(t *testing.T) {
		user2, err := userService.GetUserByID(2)
		assert.Error(t, err)
		assert.Nil(t, user2)
	})
	mockRepo.AssertExpectations(t)
}

func TestUserService_AuthenticateUser(t *testing.T) {
	mockRepo := new(MockRepository)
	userService := services.NewUserService(mockRepo)

	// Prepare a user and mock the repository
	mockRepo.
		On("FindByEmail", "test@example.com").Return(func() *models.UserModel {
		model := &models.UserModel{
			Email:    "test@example.com",
			Password: "$2y$10$pwOrKjsSJcYD2g6fUEUxZ.GTMLPO3aCNXtVqXNWOMDY.DuXSnThCG", // mock hashed password
		}
		model.ID = 1
		return model
	}(), nil).
		On("FindByEmail", "nonexistent@example.com").Return(nil, gorm.ErrRecordNotFound)

	// Correct credentials test
	t.Run("AuthenticateUser Success", func(t *testing.T) {
		inputDTO1 := &dto.AuthUserDTO{
			Email:    "test@example.com",
			Password: "plaintextPassword",
		}
		id1, err := userService.AuthenticateUser(inputDTO1)
		assert.NoError(t, err)
		assert.Equal(t, id1, 1)
	})

	t.Run("AuthenticateUser Incorrect Password", func(t *testing.T) {
		inputDTO2 := &dto.AuthUserDTO{
			Email:    "test@example.com",
			Password: "wrongPassword",
		}
		id2, err := userService.AuthenticateUser(inputDTO2)
		assert.Error(t, err)
		assert.Equal(t, err, services.ErrAuthenticationFailed)
		assert.Zero(t, id2)
	})

	t.Run("AuthenticateUser Nonexistent User", func(t *testing.T) {
		inputDTO3 := &dto.AuthUserDTO{
			Email:    "nonexistent@example.com",
			Password: "wrongPassword",
		}
		id3, err := userService.AuthenticateUser(inputDTO3)
		assert.Error(t, err)
		assert.Equal(t, err, services.ErrAuthenticationFailed)
		assert.Zero(t, id3)
	})
	// Assert expectations for the mock calls
	mockRepo.AssertExpectations(t)
}
