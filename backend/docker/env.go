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
	frontendPort := os.Getenv("FRONTEND_PORT")
	return fmt.Sprintf("http://react:%s", frontendPort)
}

func GetBackendPort() string {
	return fmt.Sprintf(":%s", os.Getenv("API_PORT"))
}
