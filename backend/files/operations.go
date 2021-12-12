package files

import (
	"backend/utils"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func UploadFile(c *gin.Context) {
	file, err := c.FormFile("fileObject")
	utils.CheckError(err, true)
	name := c.PostForm("fileDescription")

	newFileName := name + filepath.Ext(file.Filename)
	err = c.SaveUploadedFile(file, "../init_data/files/"+newFileName)
	utils.CheckError(err, true)

	c.JSON(200, "OK")
}

func DownloadFile(c *gin.Context) {
	name := c.PostForm("fileDescription")
	filePath := "../init_data/files/" + name
	c.File(filePath)
}
