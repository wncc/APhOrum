package main

import (
	"backend/auth"
	"backend/bulletin"
	"backend/db"
	"backend/files"
	"backend/paper"

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

	client, ctx := db.InitMongo()
	defer client.Disconnect(ctx)

	// Auth
	router.GET("/auth/init", auth.CreateStore)
	router.GET("/auth/verify", auth.VerifyToken)
	router.POST("/auth/login", auth.Login)
	router.GET("/auth/resetPassword", auth.ResetPassword)
	router.POST("/auth/changePassword", auth.ChangePassword)
	router.GET("/auth/logout", auth.Logout)

	// Bulletin
	router.GET("/bulletin", bulletin.GetBulletin)
	router.POST("/bulletin", bulletin.PostBulletin)

	// Paper
	router.GET("/paper/init", paper.CreateStore)
	router.GET("/paper/summaryInfo", paper.GetSummaryInfo)
	router.GET("/paper/translate/:id", paper.GetTranslation)
	router.POST("/paper/translate", paper.PostTranslation)
	router.GET("/paper/translate/download", paper.DownloadTranslation)

	// Files
	router.POST("/file/upload", files.UploadFile)
	router.POST("/file/download", files.DownloadFile)

	router.Run(":8080")
}
