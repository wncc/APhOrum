package files

import (
	"backend/utils"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func UploadFile(c *gin.Context) {
	file, err := c.FormFile("fileObject")
	utils.CheckError(err, true)
	name := c.PostForm("fileDescription")

	newFileName := name + filepath.Ext(file.Filename)
	err = c.SaveUploadedFile(file, "../data/files/"+newFileName)
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}

func DownloadFile(c *gin.Context) {
	name := c.PostForm("fileDescription")
	filePath := "../data/files/" + name
	c.File(filePath)
}

func ListFiles(c *gin.Context) {
	var dir *os.File
	var err error
	var fileNames []string
	dir, err = os.Open("../data/files")
	utils.CheckError(err, true)
	defer dir.Close()

	fileNames, err = dir.Readdirnames(0)
	utils.CheckError(err, true)
	c.JSON(200, fileNames)
}
