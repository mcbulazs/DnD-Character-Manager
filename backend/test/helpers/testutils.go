//go:build !test

package helpers

import (
	"io"

	"github.com/DATA-DOG/go-sqlmock"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func CreateMockDB() (*gorm.DB, sqlmock.Sqlmock, error) {
	db, mock, err := sqlmock.New()
	if err != nil {
		return nil, nil, err
	}
	dialector := postgres.New(postgres.Config{
		Conn:       db,
		DriverName: "postgres",
	})
	gormDB, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		return nil, nil, err
	}
	return gormDB, mock, nil
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
