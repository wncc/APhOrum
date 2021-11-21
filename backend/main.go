package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Static("/ui", "../frontend/static")

	router.POST("/api/latex_to_pdf", latex_to_pdf)
	router.POST("/api/save_annotations", save_annotations)

	router.GET("/api/polls", GetPollHandler)
	router.POST("/api/polls", CreatePollHandler)

	router.Run(":8080")
}
