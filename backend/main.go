package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Static("/ui", "../frontend/static")

	router.POST("/api/latex_to_pdf", latex_to_pdf)

	router.Run(":8080")
}
