package paper

import (
	"backend/db"
	"backend/utils"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rwestlund/gotex"
	"go.mongodb.org/mongo-driver/bson"
)

type question struct {
	Id             int8
	MatchString    string
	EnglishText    string
	TranslatedText string
}

type paper struct {
	Stub      string
	Questions []question
}

func CreateStore(c *gin.Context) {
	// Read from files
	var p paper

	b, err := ioutil.ReadFile("../init_data/paper.texstub")
	utils.CheckError(err, true)
	s := string(b)
	p.Stub = s

	rex := regexp.MustCompile(`<<APhOrum_(.*)>>`)
	matches := rex.FindAllStringSubmatch(s, -1)

	var qs string
	for i, n := range matches {
		b, err = ioutil.ReadFile(fmt.Sprintf("../init_data/%s.texstub", n[1]))
		utils.CheckError(err, true)
		qs = string(b)
		p.Questions = append(p.Questions, question{Id: int8(i), MatchString: n[0], EnglishText: qs, TranslatedText: qs})
	}

	paperCollection, ctx := db.GetCollection("paper")
	err = paperCollection.Drop(ctx)
	utils.CheckError(err, true)
	_, err = paperCollection.InsertOne(ctx, p)
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}

func GetSummaryInfo(c *gin.Context) {
	paperCollection, ctx := db.GetCollection("paper")
	var p paper
	err := paperCollection.FindOne(ctx, bson.M{}).Decode(&p)
	utils.CheckError(err, true)

	c.JSON(200, len(p.Questions))
}

func GetTranslation(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 8)

	paperCollection, ctx := db.GetCollection("paper")
	var p paper
	err := paperCollection.FindOne(ctx, bson.M{}).Decode(&p)
	utils.CheckError(err, true)

	c.JSON(200, p.Questions[id])
}

func PostTranslation(c *gin.Context) {
	var q question
	err := c.BindJSON(&q)
	utils.CheckError(err, true)

	paperCollection, ctx := db.GetCollection("paper")
	var p paper
	err = paperCollection.FindOne(ctx, bson.M{}).Decode(&p)
	utils.CheckError(err, true)

	p.Questions[q.Id].TranslatedText = q.TranslatedText
	_, err = paperCollection.UpdateOne(ctx, bson.M{}, bson.M{"$set": bson.M{"questions": p.Questions}})
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}

func DownloadTranslation(c *gin.Context) {
	paperCollection, ctx := db.GetCollection("paper")
	var p paper
	err := paperCollection.FindOne(ctx, bson.M{}).Decode(&p)
	utils.CheckError(err, true)

	s := p.Stub
	for _, q := range p.Questions {
		s = strings.ReplaceAll(s, q.MatchString, q.TranslatedText)
	}

	pdf, err := gotex.Render(s, gotex.Options{
		Command: "xelatex",
		Runs:    1,
	})
	utils.CheckError(err, true)

	err = os.WriteFile("../init_data/paper.pdf", []byte(pdf), 0644)
	utils.CheckError(err, true)

	c.File("../init_data/paper.pdf")
}