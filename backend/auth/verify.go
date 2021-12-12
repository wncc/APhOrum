package auth

import (
	"backend/utils"
	"context"
	"crypto/md5"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type changePasswordData struct {
	OldPassword string
	NewPassword string
}

func Login(c *gin.Context) {
	var authData userAuthData
	err := c.BindJSON(&authData)
	utils.CheckError(err, true)

	// Get data from Mongo
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://127.0.0.1:27017"))
	utils.CheckError(err, true)

	ctx := context.Background()
	err = client.Connect(ctx)
	utils.CheckError(err, true)
	defer client.Disconnect(ctx)

	usersCollection := client.Database("APhOrum").Collection("users")
	authData.Password = fmt.Sprintf("%x", md5.Sum([]byte(authData.Password)))

	filter := bson.M{"username": authData.Username, "password": authData.Password}
	count, _ := usersCollection.CountDocuments(ctx, filter)
	if count == 1 {
		token := fmt.Sprintf("%x", md5.Sum([]byte(time.Now().String()+authData.Username+authData.Password)))
		c.SetCookie("token", token, 60*60, "/", "", false, true)
		_, err = usersCollection.UpdateOne(ctx, filter, bson.M{"$set": bson.M{"token": token}})
		utils.CheckError(err, true)
		c.JSON(200, "OK")
	} else {
		c.JSON(401, "Access Denied")
	}
}

func ResetPassword(c *gin.Context) {
	token, _ := c.Cookie("token")

	// Get data from Mongo
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://127.0.0.1:27017"))
	utils.CheckError(err, true)

	ctx := context.Background()
	err = client.Connect(ctx)
	utils.CheckError(err, true)
	defer client.Disconnect(ctx)

	usersCollection := client.Database("APhOrum").Collection("users")
	defaultPassword := fmt.Sprintf("%x", md5.Sum([]byte("default")))
	_, err = usersCollection.UpdateOne(ctx, bson.M{"token": token}, bson.M{"$set": bson.M{"password": defaultPassword}})
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}

func ChangePassword(c *gin.Context) {
	// Get user data
	token, _ := c.Cookie("token")

	var d changePasswordData
	err := c.BindJSON(&d)
	utils.CheckError(err, true)

	// Get data from Mongo
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://127.0.0.1:27017"))
	utils.CheckError(err, true)

	ctx := context.Background()
	err = client.Connect(ctx)
	utils.CheckError(err, true)
	defer client.Disconnect(ctx)

	usersCollection := client.Database("APhOrum").Collection("users")
	oldPassword := fmt.Sprintf("%x", md5.Sum([]byte(d.OldPassword)))
	newPassword := fmt.Sprintf("%x", md5.Sum([]byte(d.NewPassword)))

	filter := bson.M{"token": token}
	count, _ := usersCollection.CountDocuments(ctx, filter)
	if count == 1 {
		filter["password"] = oldPassword
		updateResult, _ := usersCollection.UpdateOne(ctx, filter, bson.M{"$set": bson.M{"password": newPassword}})
		if updateResult.ModifiedCount == 1 {
			c.JSON(200, "OK")
		} else {
			c.JSON(401, "No change")
		}
	} else {
		c.JSON(401, "Access Denied")
	}
}

func Logout(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", "", false, true)
	c.JSON(200, "OK")
}

func VerifyToken(c *gin.Context) {
	token, _ := c.Cookie("token")

	// Get data from Mongo
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://127.0.0.1:27017"))
	utils.CheckError(err, true)

	ctx := context.Background()
	err = client.Connect(ctx)
	utils.CheckError(err, true)
	defer client.Disconnect(ctx)

	usersCollection := client.Database("APhOrum").Collection("users")

	count, _ := usersCollection.CountDocuments(ctx, bson.M{"token": token})
	if count == 1 {
		c.JSON(200, "OK")
	} else {
		c.JSON(401, "Access Denied")
	}
}
