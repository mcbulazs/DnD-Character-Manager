package db

import (
	"fmt"
	"os"
)

func GetConnectionString() string {	
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName :=os.Getenv("DB_NAME")
	dbHost := "postgres"
	connStr := fmt.Sprintf(
		"user=%s dbname=%s password=%s host=%s sslmode=disable",
		dbUser, dbName, dbPassword, dbHost)
	return connStr
}