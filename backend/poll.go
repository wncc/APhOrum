package main

import (
	"fmt"
    "gopkg.in/mgo.v2"
    "gopkg.in/mgo.v2/bson"
    "net/http"
	"github.com/gin-gonic/gin"
)

type Poll struct {

	Title string
	Author string
	Options [4]string
	ID string
}

func CreatePoll(poll *Poll) bool {

	session, err := mgo.Dial("127.0.0.1:27017/")
	if err != nil {
		fmt.Println(err)
		return false
	}

	c := session.DB("APhOrum").C("polls")
	result := Poll{}

	err = c.Find(bson.M{"id": poll.ID}).One(&result)

	if result.ID != "" {
	    // already present
		return true
	}

	err = c.Insert(*poll)

	if err != nil {
		return false
	}

	session.Close()

	return true
}

func FindPolls() (polls []Poll) {

	session, err := mgo.Dial("127.0.0.1:27017/")
	if err != nil {
		fmt.Println(err)
		return nil
	}

	c := session.DB("APhOrum").C("polls")

	err = c.Find(bson.M{}).All(&polls)
	session.Close()

	return polls
}

func GetPollHandler(ctx *gin.Context) {
	var polls = FindPolls()

	ctx.Header("Content-Type", "application/json")
    ctx.JSON(http.StatusOK, polls)
}

func CreatePollHandler(ctx *gin.Context) {

    var poll *Poll

    if err := ctx.BindJSON(&poll); err != nil {
        return
    }

    CreatePoll(poll)

    ctx.IndentedJSON(http.StatusCreated, poll)
}