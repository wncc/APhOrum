package main

import (
	"backend/auth"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	auth.CreateStore()

	router.GET("/auth/verify", auth.VerifyToken)
	// router.POST("/auth/login", XYZ)
	// router.GET("/auth/logout", XYZ)
	// 	router.Static("/ui", "../frontend/static")

	// 	router.POST("/api/latex_to_pdf", latex_to_pdf)
	// 	router.POST("/api/save_annotations", save_annotations)
	//
	// 	router.GET("/api/polls", GetPollHandler)
	// 	router.POST("/api/polls", CreatePollHandler)

	router.Run(":8080")
}
