package auth

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"

	"gopkg.in/mgo.v2"
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

func CreateStore() {
	f, err := os.Open("users.csv")
	check_error(err, true)

	csvReader := csv.NewReader(f)
	records, err := csvReader.ReadAll()
	check_error(err, true)

	session, err := mgo.Dial("127.0.0.1:27017/")
	if err != nil {
		fmt.Println(err)
	}

	c := session.DB("APhOrum").C("users")

	for _, entry := range records[1:] {
		err = c.Insert(userAuthData{Username: entry[0], Password: entry[1], Token: "", Active: false})
		if err != nil {
			// throw new RuntimeException()
		}
	}

	session.Close()
}
