package main

import (
	db "DnDCharacterSheet/DB"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	db.Init_db()

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	err := r.Run(":3000")
	if err != nil {
		fmt.Println(err.Error())
	}
}
