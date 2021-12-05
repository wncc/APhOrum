package auth

import "github.com/gin-gonic/gin"

var authStore = createStore()

func VerifyToken(c *gin.Context) {
	user, err := c.Cookie("user")
	check_error(err, false)

	token, err := c.Cookie("token")
	check_error(err, false)

	if authStore[user].Token == token {
		c.JSON(200, "OK")
	} else {
		c.JSON(403, "Access denied")
	}
}
