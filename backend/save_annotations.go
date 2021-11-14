package main

import (
	"os"

	"github.com/gin-gonic/gin"
)

func save_annotations(ctx *gin.Context) {
	var params content
	err := ctx.BindJSON(&params)
	check_error(err, false)

	err = os.WriteFile("../frontend/static/img1_anno.json", []byte(params.Content), 0644)
	check_error(err, false)

	ctx.String(200, "OK")
}
