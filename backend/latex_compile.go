package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/rwestlund/gotex"
)

func check_error(e error, p bool) {
	if e != nil {
		if p {
			panic(e)
		} else {
			log.Println("Error has occured: ", e)
		}
	}
}

type content struct {
	Content string `json:"content" binding:"required"`
}

func latex_to_pdf(ctx *gin.Context) {
	var params content
	err := ctx.BindJSON(&params)
	check_error(err, false)

	document := `
		\documentclass[12pt]{article}
		\begin{document}
		Hello, %s 
		\end{document}`
	document = fmt.Sprintf(document, params.Content)

	pdf, err := gotex.Render(document, gotex.Options{
		Command: "xelatex",
		Runs:    1,
	})
	check_error(err, false)

	err = os.WriteFile("../frontend/static/inp1.pdf", []byte(pdf), 0644)
	check_error(err, false)

	ctx.JSON(200, gin.H{
		"file_name": "inp1.pdf",
	})
}
