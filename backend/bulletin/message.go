package bulletin

import (
	"backend/db"
	"backend/utils"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

type message struct {
	Message string
	Expiry  int64
}

func GetBulletin(c *gin.Context) {
	msgCollection, ctx := db.GetCollection("messages")
	validTime := time.Now().Unix()
	filter := bson.M{"expiry": bson.M{"$gte": validTime}}
	cursor, err := msgCollection.Find(ctx, filter)
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

	msgCollection, ctx := db.GetCollection("messages")
	_, err = msgCollection.InsertOne(ctx, msg)
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}
