'use strict'

import React, { Component } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import config from './config.json'

class FileIO extends Component {
  constructor(props) {
    super(props);
    this.state = { fileList: [], filePath: '', fileName: '', fileObject: null };
  }

  updateFileList() {
    fetch(config.BACKEND_URL + '/file/list', {
      method: 'GET'
    }).then(response => {
      if (response.ok) return response.json()
    }).then(json => {
      this.setState({ fileList: json })
    }).catch(err => {
      console.log('Error:', err);
    })
  }

  componentDidMount() {
    this.updateFileList()
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('fileObject', this.state.fileObject)
    formData.append('fileDescription', this.state.fileName)

    fetch(config.BACKEND_URL + '/file/upload', {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) return response.json()
    }).then(() => {
      this.setState({ filePath: '', fileName: '', fileObject: null })
      this.updateFileList()
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  handleFileDownloadClick = (event) => {
    const formData = new FormData();
    const fileName = event.target.text;
    formData.append('fileDescription', fileName)

    fetch(config.BACKEND_URL + '/file/download', {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) return response.blob()
    }).then((blob) => {
      const a = document.createElement("a")
      const href = window.URL.createObjectURL(blob)

      a.href = href; a.download = fileName; a.click(); a.remove()
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h4" sx={{ mb: 2 }}>Upload a File</Typography>
          <Box component="form" novalidate autoComplete="off" onSubmit={this.handleSubmit}>
            <input
              type="file"
              accept=".pdf"
              id="upload-file"
              style={{ display: 'none' }}
              onChange={(e) => this.setState({ filePath: e.target.value, fileObject: e.target.files[0] })}
            />
            <label htmlFor="upload-file">
              <Typography>File Path: {this.state.filePath}</Typography>
              <Button variant="contained" component="span">Choose File</Button>
            </label>
            <Box sx={{ my: 2 }}>
              <TextField onChange={(e) => this.setState({ fileName: e.target.value })} value={this.state.fileName} label="File name?" variant="outlined" />
            </Box>
            <Box sx={{ mt: 2 }}><Button variant="contained" type="submit">Upload</Button></Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Typography variant="h4" sx={{ mb: 2 }}>Download Files</Typography>
            {this.state.fileList.map(fileName => {
              return (
                <Link
                  href="#"
                  variant="body2"
                  sx={{ display: 'block' }}
                  onClick={this.handleFileDownloadClick}
                >
                  {fileName}
                </Link>
              )
            })}
          </Box>
        </Grid>
      </Grid>
    )
  };
}

export default FileIO