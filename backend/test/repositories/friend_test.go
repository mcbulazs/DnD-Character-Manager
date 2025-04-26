package repositories

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"DnDCharacterSheet/models"
	"DnDCharacterSheet/repositories"
	"DnDCharacterSheet/test/helpers"
)

func TestFriendRepository_GetUserFriend(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	friendRepo := repositories.NewFriendRepository(db)

	// Create main user
	user := &models.UserModel{
		Email:    "main@example.com",
		Password: "securepassword",
	}
	err := userRepo.Create(user)
	assert.NoError(t, err)

	// Create friend user
	friendUser := &models.UserModel{
		Email:    "friend@example.com",
		Password: "anotherpassword",
	}
	err = userRepo.Create(friendUser)
	assert.NoError(t, err)

	// Create friendship
	friend := &models.FriendsModel{
		UserID:   user.ID,
		FriendID: friendUser.ID,
		Note:     "Best bud",
		Name:     "FriendlyName",
	}
	err = db.Create(friend).Error
	assert.NoError(t, err)

	t.Run("Get existing friendship", func(t *testing.T) {
		result, err := friendRepo.GetUserFriend(user.ID, friendUser.ID)
		assert.NoError(t, err)
		assert.NotNil(t, result)
		assert.Equal(t, user.ID, result.UserID)
		assert.Equal(t, friendUser.ID, result.FriendID)
		assert.Equal(t, "Best bud", result.Note)
		assert.Equal(t, "FriendlyName", result.Name)
		assert.Equal(t, "friend@example.com", result.Friend.Email) // Preloaded
	})

	t.Run("Get non-existent friendship", func(t *testing.T) {
		nonExistentFriend, err := friendRepo.GetUserFriend(user.ID, 99999)
		assert.Error(t, err)
		assert.Nil(t, nonExistentFriend)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestFriendRepository_AcceptFriendRequest(t *testing.T) {
	db := helpers.SetupTestDB(t)

	userRepo := repositories.NewUserRepository(db)
	friendRepo := repositories.NewFriendRepository(db)

	// Create source user (who sends the request)
	sourceUser := &models.UserModel{
		Email:    "source@test.com",
		Password: "password123",
	}
	err := userRepo.Create(sourceUser)
	assert.NoError(t, err)

	// Create destination user (who accepts the request)
	destUser := &models.UserModel{
		Email:    "dest@test.com",
		Password: "password123",
	}
	err = userRepo.Create(destUser)
	assert.NoError(t, err)

	// Create a pending friend request
	friendRequest := &models.FriendRequestModel{
		SourceUserID:      sourceUser.ID,
		DestinationUserID: destUser.ID,
		Status:            models.FriendRequestsStatusEnum.Pending,
	}
	err = db.Create(friendRequest).Error
	assert.NoError(t, err)

	t.Run("Accepts valid friend request and creates friendships", func(t *testing.T) {
		err, updatedRequest := friendRepo.AcceptFriendRequest(friendRequest.ID, destUser.ID)
		assert.NoError(t, err)
		assert.NotNil(t, updatedRequest)
		assert.Equal(t, models.FriendRequestsStatusEnum.Accepted, updatedRequest.Status)

		var friendships []models.FriendsModel
		err = db.
			Where("user_id IN ? AND friend_id IN ?", []uint{sourceUser.ID, destUser.ID}, []uint{sourceUser.ID, destUser.ID}).
			Find(&friendships).Error
		assert.NoError(t, err)
		assert.Equal(t, 2, len(friendships)) // Mutual relationship
	})

	t.Run("Fails if user is not destination of the request", func(t *testing.T) {
		// Try accepting with wrong user ID
		err, updatedRequest := friendRepo.AcceptFriendRequest(friendRequest.ID, sourceUser.ID)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
		assert.Nil(t, updatedRequest)
	})
}

func TestFriendRepository_DeclineFriendRequest(t *testing.T) {
	db := helpers.SetupTestDB(t)

	userRepo := repositories.NewUserRepository(db)
	friendRepo := repositories.NewFriendRepository(db)

	// Create users
	sourceUser := &models.UserModel{
		Email:    "source2@test.com",
		Password: "password123",
	}
	err := userRepo.Create(sourceUser)
	assert.NoError(t, err)

	destUser := &models.UserModel{
		Email:    "dest2@test.com",
		Password: "password123",
	}
	err = userRepo.Create(destUser)
	assert.NoError(t, err)

	// Create pending friend request
	friendRequest := &models.FriendRequestModel{
		SourceUserID:      sourceUser.ID,
		DestinationUserID: destUser.ID,
		Status:            models.FriendRequestsStatusEnum.Pending,
	}
	err = db.Create(friendRequest).Error
	assert.NoError(t, err)

	t.Run("Declines valid friend request", func(t *testing.T) {
		err, declinedRequest := friendRepo.DeclineFriendRequest(friendRequest.ID, destUser.ID)
		assert.NoError(t, err)
		assert.NotNil(t, declinedRequest)
		assert.Equal(t, models.FriendRequestsStatusEnum.Declined, declinedRequest.Status)

		var refreshed models.FriendRequestModel
		err = db.First(&refreshed, friendRequest.ID).Error
		assert.NoError(t, err)
		assert.Equal(t, models.FriendRequestsStatusEnum.Declined, refreshed.Status)
	})

	t.Run("Fails if wrong user tries to decline", func(t *testing.T) {
		err, declinedRequest := friendRepo.DeclineFriendRequest(friendRequest.ID, sourceUser.ID)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
		assert.Nil(t, declinedRequest)
	})
}

func TestFriendRepository_SendFriendRequest(t *testing.T) {
	db := helpers.SetupTestDB(t)

	userRepo := repositories.NewUserRepository(db)
	friendRepo := repositories.NewFriendRepository(db)

	// Create users
	sourceUser := &models.UserModel{
		Email:    "sender@test.com",
		Password: "pass123",
	}
	err := userRepo.Create(sourceUser)
	assert.NoError(t, err)

	destUser := &models.UserModel{
		Email:    "receiver@test.com",
		Password: "pass123",
	}
	err = userRepo.Create(destUser)
	assert.NoError(t, err)

	t.Run("Sends a friend request successfully", func(t *testing.T) {
		err := friendRepo.SendFriendRequest(sourceUser.ID, destUser.ID)
		assert.NoError(t, err)

		var request models.FriendRequestModel
		err = db.Where("source_user_id = ? AND destination_user_id = ?", sourceUser.ID, destUser.ID).First(&request).Error
		assert.NoError(t, err)
		assert.Equal(t, models.FriendRequestsStatusEnum.Pending, request.Status)
	})

	t.Run("Fails to send duplicate pending request", func(t *testing.T) {
		err := friendRepo.SendFriendRequest(sourceUser.ID, destUser.ID)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestFriendRepository_Unfriend(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	friendRepo := repositories.NewFriendRepository(db)

	// Create two users
	user1 := &models.UserModel{Email: "user1@test.com", Password: "testpass"}
	user2 := &models.UserModel{Email: "user2@test.com", Password: "testpass"}
	assert.NoError(t, userRepo.Create(user1))
	assert.NoError(t, userRepo.Create(user2))

	// Create mutual friendship
	friendship1 := &models.FriendsModel{UserID: user1.ID, FriendID: user2.ID}
	friendship2 := &models.FriendsModel{UserID: user2.ID, FriendID: user1.ID}
	assert.NoError(t, db.Create(friendship1).Error)
	assert.NoError(t, db.Create(friendship2).Error)

	t.Run("Successfully unfriends both directions", func(t *testing.T) {
		err := friendRepo.Unfriend(user1.ID, user2.ID)
		assert.NoError(t, err)

		var count int64
		db.Model(&models.FriendsModel{}).
			Where("(user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
				user1.ID, user2.ID, user2.ID, user1.ID).
			Count(&count)

		assert.Equal(t, int64(0), count)
	})

	t.Run("Unfriending non-existent relationship does nothing", func(t *testing.T) {
		err := friendRepo.Unfriend(user1.ID, user2.ID)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestFriendRepository_UpdateName(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	friendRepo := repositories.NewFriendRepository(db)

	// Create users
	user1 := &models.UserModel{Email: "user1@example.com", Password: "secret"}
	user2 := &models.UserModel{Email: "user2@example.com", Password: "secret"}
	user3 := &models.UserModel{Email: "user3@example.com", Password: "secret"}
	assert.NoError(t, userRepo.Create(user1))
	assert.NoError(t, userRepo.Create(user2))
	assert.NoError(t, userRepo.Create(user3))

	// Create friendship
	friend := &models.FriendsModel{
		UserID:   user1.ID,
		FriendID: user2.ID,
		Name:     "Old Name",
	}
	assert.NoError(t, db.Create(friend).Error)

	t.Run("Update friend name successfully", func(t *testing.T) {
		newName := "Updated Friend Name"
		err := friendRepo.UpdateName(int(user1.ID), int(user2.ID), newName)
		assert.NoError(t, err)

		var updatedFriend models.FriendsModel
		err = db.Where("user_id = ? AND friend_id = ?", user1.ID, user2.ID).First(&updatedFriend).Error
		assert.NoError(t, err)
		assert.Equal(t, newName, updatedFriend.Name)
	})

	t.Run("Fails to update non-existent relationship", func(t *testing.T) {
		err := friendRepo.UpdateName(int(user1.ID), int(user3.ID), "No one")
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})
}

func TestShareCharacter(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	friendRepo := repositories.NewFriendRepository(db)

	// Create two users
	user1 := &models.UserModel{
		Email:    "user1@example.com",
		Password: "password1",
	}
	err := userRepo.Create(user1)
	assert.NoError(t, err)

	user2 := &models.UserModel{
		Email:    "user2@example.com",
		Password: "password2",
	}
	err = userRepo.Create(user2)
	assert.NoError(t, err)

	user3 := &models.UserModel{
		Email:    "user3@example.com",
		Password: "password2",
	}
	err = userRepo.Create(user3)
	assert.NoError(t, err)

	// Create a character for user1
	character := &models.CharacterModel{
		UserID: user1.ID,
		Name:   "Character1",
		Class:  "Wizard",
		Race:   "Elf",
	}
	err = characterRepo.Create(character)
	assert.NoError(t, err)

	// Send a friend request from user1 to user2
	err = friendRepo.SendFriendRequest(user1.ID, user2.ID)
	assert.NoError(t, err)

	// Accept the friend request (simulate friendship)
	err, _ = friendRepo.AcceptFriendRequest(1, user2.ID)
	assert.NoError(t, err)

	t.Run("Share character with friend", func(t *testing.T) {
		// Share the character from user1 with user2
		err := friendRepo.ShareCharacter(character.ID, user2.ID)
		assert.NoError(t, err)

		// Verify that the character is shared with user2
		var friend models.FriendsModel
		err = db.Preload("SharedCharacters").First(&friend, "user_id = ? AND friend_id = ?", user2.ID, user1.ID).Error
		assert.NoError(t, err)
		assert.Len(t, friend.SharedCharacters, 1)
		assert.Equal(t, character.ID, friend.SharedCharacters[0].ID)

		var characterResult models.CharacterModel
		err = db.Preload("SharedWith").First(&characterResult, "id = ?", character.ID).Error
		assert.NoError(t, err)
		assert.Len(t, characterResult.SharedWith, 1)
		assert.Equal(t, friend.ID, characterResult.SharedWith[0].UserID)
	})

	t.Run("Cannot share character if not friends", func(t *testing.T) {
		// Try sharing the character without being friends (user1 to user2)
		err := friendRepo.ShareCharacter(character.ID, user3.ID)
		assert.Error(t, err)
	})
}

func TestUnshareCharacter(t *testing.T) {
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	friendRepo := repositories.NewFriendRepository(db)

	// Create three users
	user1 := &models.UserModel{
		Email:    "user1@example.com",
		Password: "password1",
	}
	err := userRepo.Create(user1)
	assert.NoError(t, err)

	user2 := &models.UserModel{
		Email:    "user2@example.com",
		Password: "password2",
	}
	err = userRepo.Create(user2)
	assert.NoError(t, err)

	user3 := &models.UserModel{
		Email:    "user3@example.com",
		Password: "password2",
	}
	err = userRepo.Create(user3)
	assert.NoError(t, err)

	// Create a character for user1
	character := &models.CharacterModel{
		UserID: user1.ID,
		Name:   "Character1",
		Class:  "Wizard",
		Race:   "Elf",
	}
	err = characterRepo.Create(character)
	assert.NoError(t, err)

	// Send and accept a friend request from user1 to user2
	err = friendRepo.SendFriendRequest(user1.ID, user2.ID)
	assert.NoError(t, err)
	err, _ = friendRepo.AcceptFriendRequest(1, user2.ID)
	assert.NoError(t, err)

	// Share the character from user1 with user2
	err = friendRepo.ShareCharacter(character.ID, user2.ID)
	assert.NoError(t, err)

	t.Run("Unshare character from friend", func(t *testing.T) {
		// Unshare the character from user1 to user2
		err := friendRepo.UnshareCharacter(character.ID, user2.ID)
		assert.NoError(t, err)

		// Verify that the character is no longer shared with user2
		var friend models.FriendsModel
		err = db.Preload("SharedCharacters").First(&friend, "user_id = ? AND friend_id = ?", user2.ID, user1.ID).Error
		assert.NoError(t, err)
		assert.Len(t, friend.SharedCharacters, 0)

		var characterResult models.CharacterModel
		err = db.Preload("SharedWith").First(&characterResult, "id = ?", character.ID).Error
		assert.NoError(t, err)
		assert.Len(t, characterResult.SharedWith, 0)
	})
}

func TestFindByUserIDAndFriendID(t *testing.T) {
	// Setup the test database and repositories
	db := helpers.SetupTestDB(t)
	userRepo := repositories.NewUserRepository(db)
	characterRepo := repositories.NewCharacterRepository(db)
	friendRepo := repositories.NewFriendRepository(db)

	// Create three users
	user1 := &models.UserModel{
		Email:    "user1@example.com",
		Password: "password1",
	}
	err := userRepo.Create(user1)
	assert.NoError(t, err)

	user2 := &models.UserModel{
		Email:    "user2@example.com",
		Password: "password2",
	}
	err = userRepo.Create(user2)
	assert.NoError(t, err)

	user3 := &models.UserModel{
		Email:    "user3@example.com",
		Password: "password3",
	}
	err = userRepo.Create(user3)
	assert.NoError(t, err)

	// Create characters for user1
	character1 := &models.CharacterModel{
		UserID: user1.ID,
		Name:   "Character1",
		Class:  "Wizard",
		Race:   "Elf",
	}
	err = characterRepo.Create(character1)
	assert.NoError(t, err)

	// Send a friend request from user1 to user2
	err = friendRepo.SendFriendRequest(user1.ID, user2.ID)
	assert.NoError(t, err)

	// Accept the friend request (simulate friendship)
	err, _ = friendRepo.AcceptFriendRequest(1, user2.ID)
	assert.NoError(t, err)

	// Share the character from user1 with user2
	err = friendRepo.ShareCharacter(character1.ID, user2.ID)
	assert.NoError(t, err)

	t.Run("Find shared characters by userID and friendID", func(t *testing.T) {
		// Find shared characters between user1 and user2
		characters, err := friendRepo.FindByUserIDAndFriendID(user2.ID, user1.ID)
		assert.NoError(t, err)
		assert.Len(t, characters, 1) // user1 shared 1 character with user2
		assert.Equal(t, character1.ID, characters[0].ID)
	})

	t.Run("No shared characters for non-friends", func(t *testing.T) {
		// Try to find shared characters for user1 and user3 (who are not friends)
		characters, err := friendRepo.FindByUserIDAndFriendID(user1.ID, user3.ID)
		assert.Error(t, err)
		assert.Nil(t, characters) // No shared characters because user1 and user3 are not friends
		assert.Equal(t, gorm.ErrRecordNotFound, err)
	})

	t.Run("Error when no friendship exists", func(t *testing.T) {
		// Try to find shared characters when no friendship exists (user2 and user3)
		characters, err := friendRepo.FindByUserIDAndFriendID(user2.ID, user3.ID)
		assert.Error(t, err)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
		assert.Nil(t, characters) // No shared characters because user2 and user3 are not friends
	})
}
