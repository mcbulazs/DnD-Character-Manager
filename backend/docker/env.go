package env

import (
	"fmt"
	"os"
)

func GetConnectionString() string {
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbHost := "postgres"
	connStr := fmt.Sprintf(
		"user=%s dbname=%s password=%s host=%s sslmode=disable",
		dbUser, dbName, dbPassword, dbHost)
	return connStr
}

func GetStoreHash() string {
	return os.Getenv("SESSION_KEY")
}

func GetFrontendURL() string {
	return "http://dnd_react:3000" // FIX  Why isnt it handled by env
}

func AllowedOrigins() []string {
	return []string{"https://dnd.bulazs.com"} // FIX  Why isnt it handled by env
}
