package auth

import (
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func VerifyToken(c *gin.Context) {
	user, err := c.Cookie("user")
	check_error(err, false)

	token, err := c.Cookie("token")
	check_error(err, false)

	if fetchToken(user) == token {
		c.JSON(200, "OK")
	} else {
		c.JSON(403, "Access denied")
	}
}

func fetchToken(user string) (token string) {
	var session *mgo.Session
	var err error
	session, err = mgo.Dial("127.0.0.1:27017/")
	check_error(err, false)

	c := session.DB("APhOrum").C("users")

	err = c.Find(bson.M{"user": user}).Select(bson.M{"token": 1}).One(&token)
	check_error(err, false)
	session.Close()

	return token
}
