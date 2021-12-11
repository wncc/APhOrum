package auth

import (
	"backend/utils"
	"context"
	"encoding/csv"
	"os"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserAuthData struct {
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
		authData = append(authData, UserAuthData{Username: entry[0], Password: entry[1]})
	}

	// Write to Mongo
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://127.0.0.1:27017"))
	utils.CheckError(err, true)

	ctx := context.Background()
	err = client.Connect(ctx)
	utils.CheckError(err, true)
	defer client.Disconnect(ctx)

	usersCollection := client.Database("APhOrum").Collection("users")
	err = usersCollection.Drop(ctx)
	utils.CheckError(err, true)
	_, err = usersCollection.InsertMany(ctx, authData)
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}
