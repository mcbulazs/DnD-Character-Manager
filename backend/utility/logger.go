package utility

import (
	"fmt"
	"io"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm/logger"
)

var (
	AppLogger  *log.Logger
	GormLogger logger.Interface
)

func InitLogger() func() {
	var err error
	// Open or create the log file
	logFile, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Failed to open log file: %v", err)
	}

	// Initialize the shared application logger
	AppLogger = log.New(logFile, "APP: ", log.Ldate|log.Ltime|log.Lshortfile)

	// Initialize GORM logger using the shared log file
	GormLogger = logger.New(
		log.New(logFile, "GORM: ", log.Ldate|log.Ltime|log.Lshortfile),
		logger.Config{
			SlowThreshold: time.Second, // Slow SQL threshold
			LogLevel:      logger.Info, // Log level
			Colorful:      false,       // Disable color
		},
	)
	multiWriter := io.MultiWriter(os.Stdout, logFile)
	gin.DefaultErrorWriter = multiWriter
	gin.DefaultWriter = multiWriter
	return func() {
		fmt.Println("Closing log file")
		logFile.Close()
	}
}
