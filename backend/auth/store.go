package auth

import (
	"backend/db"
	"backend/utils"
	"encoding/csv"
	"os"

	"github.com/gin-gonic/gin"
)

type userAuthData struct {
	Username string
	Password string
	Token    string
}

func CreateStore(c *gin.Context) {
	// Load user info
	f, err := os.Open("../init_data/users.csv")
	utils.CheckError(err, true)

	csvReader := csv.NewReader(f)
	records, err := csvReader.ReadAll()
	utils.CheckError(err, true)

	var authData []interface{}
	for _, entry := range records[1:] {
		authData = append(authData, userAuthData{Username: entry[0], Password: entry[1]})
	}

	usersCollection, ctx := db.GetCollection("users")
	err = usersCollection.Drop(ctx)
	utils.CheckError(err, true)
	_, err = usersCollection.InsertMany(ctx, authData)
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}
