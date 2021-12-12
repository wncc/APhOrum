package feedback

import (
	"backend/db"
	"backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

type feedback struct {
	QuestionId string `bson:"questionId"`
	Text       string
	Status     string
	Id         string `bson:"_id"`
}

func GetFeedback(c *gin.Context) {
	feedbackCollection, ctx := db.GetCollection("feedback")
	cursor, err := feedbackCollection.Find(ctx, bson.M{})
	utils.CheckError(err, true)

	var result []feedback
	err = cursor.All(ctx, &result)
	utils.CheckError(err, true)

	c.JSON(200, result)
}

func SubmitFeedback(c *gin.Context) {
	questionId := c.PostForm("questionId")
	text := c.PostForm("text")

	feedback := feedback{QuestionId: questionId, Text: text, Status: "inactive", Id: utils.GenerateId()}

	feedbackCollection, ctx := db.GetCollection("feedback")
	_, err := feedbackCollection.InsertOne(ctx, feedback)
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}

func UpdateFeedbackStatus(c *gin.Context) {
	feedbackCollection, ctx := db.GetCollection("feedback")
	feedbackId := c.Param("feedbackId")
	status := c.Param("status")

	_, err := feedbackCollection.UpdateByID(ctx, feedbackId, bson.M{"$set": bson.M{"status": status}})
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}
