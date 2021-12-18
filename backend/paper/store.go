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
	"go.mongodb.org/mongo-driver/mongo/options"
)

type question struct {
	Id             string `bson:"_id"`
	MatchString    string
	EnglishText    string
	TranslatedText string
}

type paper struct {
	Id        string `bson:"_id"`
	Stub      string
	Questions []question
}

type marks struct {
	MarksData      string
	AnnotationData string
}

func CreateStore(c *gin.Context) {
	// Read from files
	var p paper

	b, err := ioutil.ReadFile("../data/paper.texstub")
	utils.CheckError(err, true)
	s := string(b)
	p.Stub = s

	rex := regexp.MustCompile(`<<APhOrum_(.*)>>`)
	matches := rex.FindAllStringSubmatch(s, -1)

	var qs string
	for i, n := range matches {
		b, err = ioutil.ReadFile(fmt.Sprintf("../data/%s.texstub", n[1]))
		utils.CheckError(err, true)
		qs = string(b)
		p.Questions = append(p.Questions, question{Id: strconv.Itoa(i), MatchString: n[0], EnglishText: qs, TranslatedText: qs})
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

	questionId, err := strconv.ParseInt(q.Id, 10, 8)
	utils.CheckError(err, true)

	p.Questions[questionId].TranslatedText = q.TranslatedText
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

	err = os.WriteFile("../data/paper.pdf", []byte(pdf), 0644)
	utils.CheckError(err, true)

	c.File("../data/paper.pdf")
}

func PostMarks(c *gin.Context) {
	m := marks{MarksData: c.PostForm("marksData"), AnnotationData: c.PostForm("annotationData")}

	marksCollection, ctx := db.GetCollection("marks")
	opts := options.Update().SetUpsert(true)
	_, err := marksCollection.UpdateOne(ctx, bson.M{},
		bson.M{"$set": m}, opts)
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}

func GetMarks(c *gin.Context) {
	marksCollection, ctx := db.GetCollection("marks")
	var m marks
	err := marksCollection.FindOne(ctx, bson.M{}).Decode(&m)
	utils.CheckError(err, true)

	c.JSON(200, m)
}
