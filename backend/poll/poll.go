package poll

import (
	"backend/db"
	"backend/utils"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

type poll struct {
	Title   string
	Options []string
	Status  string
	Id      string
}

func GetActivePoll(c *gin.Context) {
	pollCollection, ctx := db.GetCollection("polls")
	filter := bson.M{"status": "active"}
	var result poll
	err := pollCollection.FindOne(ctx, filter).Decode(&result)
	utils.CheckError(err, true)

	c.JSON(200, result)
}

func CreatePoll(c *gin.Context) {
	question := c.PostForm("question")
	options := strings.Split(c.PostForm("options"), ",")

	poll := poll{Title: question, Options: options, Status: "inactive", Id: "abc"}

	msgCollection, ctx := db.GetCollection("polls")
	_, err := msgCollection.InsertOne(ctx, poll)
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}

func Vote(c *gin.Context) {
	pollId := c.PostForm("pollId")
	option, err := strconv.ParseInt(c.PostForm("option"), 10, 8)
	utils.CheckError(err, true)

	voteCollection, ctx := db.GetCollection("votes")
	_, err = voteCollection.InsertOne(ctx, bson.M{"pollId": pollId, "option": option})
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}

func GetVoteCount(c *gin.Context) {
	voteCollection, ctx := db.GetCollection("votes")

	matchStage := bson.M{"$match": bson.M{"pollId": c.Param("pollId")}}
	groupStage := bson.M{"$group": bson.M{"_id": "$option", "count": bson.M{"$count": bson.M{}}}}

	cursor, err := voteCollection.Aggregate(ctx, bson.A{matchStage, groupStage})
	utils.CheckError(err, true)

	var r []voteCount
	err = cursor.All(ctx, &r)
	utils.CheckError(err, true)

	c.JSON(200, r)
}

type voteCount struct {
	Option	int `bson:"_id"`
	Count	int
}