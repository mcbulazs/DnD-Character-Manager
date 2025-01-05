package env

import "fmt"

func GetConnectionString() string {
	//! IMPORTANT: Replace the connection string with the one for your database
	dbUser := "admin"        // Replace with os.Getenv("DB_USER")
	dbPassword := "Admin123" // Replace with os.Getenv("DB_PASSWORD")
	dbName := "PSQL"         // Replace with os.Getenv("DB_NAME")
	dbHost := "localhost"    // Replace with postgres
	connStr := fmt.Sprintf(
		"user=%s dbname=%s password=%s host=%s sslmode=disable",
		dbUser, dbName, dbPassword, dbHost)
	return connStr
}

func GetStoreHash() string {
	return "ygMSEbVbH8n4IPnnmIp2NIOg1teTUwc8"
}

func GetFrontendURL() string {
	return "http://localhost:3000"
}

func GetBackendPort() string {
	return ":8080"
}
