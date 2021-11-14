package main

import (
	"log"
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
