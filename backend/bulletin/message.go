package bulletin

import (
	"backend/utils"
	"context"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type message struct {
	Message string
	Expiry  int64
}

func GetBulletin(c *gin.Context) {
	// Get data from Mongo
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://127.0.0.1:27017"))
	utils.CheckError(err, true)

	ctx := context.Background()
	err = client.Connect(ctx)
	utils.CheckError(err, true)
	defer client.Disconnect(ctx)

	msgCollection := client.Database("APhOrum").Collection("messages")
	validTime := time.Now().Unix()
	filter := bson.M{"expiry": bson.M{"$gte": validTime}}
	var cursor *mongo.Cursor
	cursor, err = msgCollection.Find(ctx, filter)
	utils.CheckError(err, true)

	var msgs []message
	err = cursor.All(ctx, &msgs)
	utils.CheckError(err, true)

	c.JSON(200, msgs)
}

func PostBulletin(c *gin.Context) {
	// read data
	var msg message
	err := c.BindJSON(&msg)
	utils.CheckError(err, true)

	// Put data to Mongo
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://127.0.0.1:27017"))
	utils.CheckError(err, true)

	ctx := context.Background()
	err = client.Connect(ctx)
	utils.CheckError(err, true)
	defer client.Disconnect(ctx)

	msgCollection := client.Database("APhOrum").Collection("messages")
	_, err = msgCollection.InsertOne(ctx, msg)
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}
