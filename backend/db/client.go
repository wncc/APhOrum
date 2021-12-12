package db

import (
	"backend/utils"
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var ctx context.Context = context.Background()

func InitMongo() (*mongo.Client, context.Context) {
	var err error
	client, err = mongo.NewClient(options.Client().ApplyURI("mongodb://127.0.0.1:27017"))
	utils.CheckError(err, true)
	err = client.Connect(ctx)
	utils.CheckError(err, true)
	return client, ctx
}

func GetCollection(collectionName string) (*mongo.Collection, context.Context) {
	return client.Database("APhOrum").Collection(collectionName), ctx
}
