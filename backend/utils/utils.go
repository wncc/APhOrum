package utils

import (
	"log"
	"strconv"
)

var i = 0

func CheckError(e error, p bool) {
	if e != nil {
		if p {
			panic(e)
		} else {
			log.Println("Error has occured: ", e)
		}
	}
}

func GenerateId() string {
	// TODO: Generate ID logic
	i = i + 1
	return strconv.Itoa(i)
}
