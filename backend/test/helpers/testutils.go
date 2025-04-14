//go:build !test

package helpers

import (
	"io"
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"DnDCharacterSheet/models"
)

func SetupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	assert.NoError(t, err)

	db.Exec("PRAGMA foreign_keys = ON;") // 👈 THIS IS CRUCIAL

	models.MigrateModels(db)
	return db
}

func JsonBody(body string) *httptestBody {
	return &httptestBody{body: body}
}

type httptestBody struct {
	body string
}

func (b *httptestBody) Read(p []byte) (n int, err error) {
	copy(p, b.body)
	if len(b.body) == 0 {
		return 0, io.EOF
	}
	n = len(b.body)
	b.body = ""
	return n, nil
}

func (b *httptestBody) Close() error {
	return nil
}
