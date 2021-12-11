package main

import (
	"backend/auth"
	"backend/bulletin"

	"github.com/gin-gonic/gin"
)

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "https://editor.swagger.io")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST,GET,OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	router := gin.Default()
	router.Use(cors())

	// Auth
	router.GET("/auth/init", auth.CreateStore)
	router.GET("/auth/verify", auth.VerifyToken)
	router.POST("/auth/login", auth.Login)
	router.GET("/auth/logout", auth.Logout)

	// Bulletin
	router.GET("/bulletin", bulletin.GetBulletin)
	router.POST("/bulletin", bulletin.PostBulletin)

	router.Run(":8080")
}
