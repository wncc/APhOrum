package auth

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func VerifyToken(c *gin.Context) {
	user, err := c.Cookie("user")
	check_error(err, false)

	token, err := c.Cookie("token")
	check_error(err, false)

	if FetchToken(user) == token {
		c.JSON(200, "OK")
	} else {
		c.JSON(403, "Access denied")
	}
}

func FetchToken(user string) (token string) {
	session, err := mgo.Dial("127.0.0.1:27017/")
	if err != nil {
		fmt.Println(err)
		return "Error"
	}

	c := session.DB("APhOrum").C("users")

	err = c.Find(bson.M{"user": user}).Select(bson.M{"token": 1}).One(&token)
	session.Close()

	return token
}
