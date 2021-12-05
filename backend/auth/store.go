package auth

import (
	"encoding/csv"
	"log"
	"os"
)

type userAuthData struct {
	Username string
	Password string
	Token    string
	Active   bool
}

func check_error(e error, p bool) {
	if e != nil {
		if p {
			panic(e)
		} else {
			log.Println("Error has occured: ", e)
		}
	}
}

func createStore() map[string]userAuthData {
	f, err := os.Open("users.csv")
	check_error(err, true)

	csvReader := csv.NewReader(f)
	records, err := csvReader.ReadAll()
	check_error(err, true)

	var storage = make(map[string]userAuthData)
	for _, entry := range records[1:] {
		storage[entry[0]] = userAuthData{Username: entry[0], Password: entry[1], Token: "", Active: false}
	}
	return storage
}
