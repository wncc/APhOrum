'use strict'

import React, { Component } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import DeleteIcon from '@mui/icons-material/Delete'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import config from './config.json'
import { Select } from '@mui/material'

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = { nQuestions: 0, qId: 0, qIdDisplay: 0, fbText: '', feedback: [] };
  }

  deleteFeedback = (event, id) => {
    fetch(config.BACKEND_URL + '/feedback/' + id.toString() + "/inactive", {
      method: 'POST'
    }).then(response => {
      if (response.ok) return response.json()
    }).then(() => {
      this.updateFeedback()
    }).catch(err => {
      console.log('Error:', err);
    })
  }

  updateFeedback = () => {
    let feedback = [];

    fetch(config.BACKEND_URL + '/feedback', {
      method: 'GET'
    }).then(response => {
      if (response.ok) return response.json()
    }).then(json => {
      if (json !== null) { json.forEach(f => { feedback.push(f) }) }
      this.setState({ feedback: feedback })
    }).catch(err => {
      console.log('Error:', err);
    })
  }

  componentDidMount() {
    fetch(config.BACKEND_URL + '/paper/summaryInfo', {
      method: 'GET'
    }).then(response => {
      if (response.ok) return response.json()
    }).then(json => {
      this.setState({ nQuestions: parseInt(json) })
      this.updateFeedback()
    }).catch(err => {
      console.log('Error:', err);
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('questionId', this.state.qId)
    formData.append('text', this.state.fbText)

    fetch(config.BACKEND_URL + '/feedback', {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) return response.json()
    }).then(() => {
      this.setState({ fbText: '' })
      this.updateFeedback()
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h4" sx={{ mb: 2 }}>Write Feedback</Typography>
          <Box component="form" novalidate autoComplete="off" onSubmit={this.handleSubmit}>
            <InputLabel id="question-id-select-label">Question No</InputLabel>
            <Select
              labelId="question-id-select-label"
              value={this.state.qId}
              sx={{ my: 2 }}
              onChange={(e) => this.setState({ qId: e.target.value })}
            >
              {Array(this.state.nQuestions).fill(1).map((_, i) => {
                return (
                  <MenuItem value={i}>{i + 1}</MenuItem>
                )
              })}
            </Select>
            <TextField
              multiline
              fullWidth
              onChange={(event) => this.setState({ fbText: event.target.value })}
              value={this.state.fbText}
              label="What is the feedback?"
              variant="outlined"
            />
            <Box sx={{ mt: 2 }}><Button variant="contained" type="submit">Submit</Button></Box>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box>
            <Typography variant="h4" sx={{ mb: 2 }}>Current Feedback</Typography>
            <InputLabel id="question-id-display-select-label">Question No</InputLabel>
            <Select
              labelId="question-id-display-select-label"
              value={this.state.qIdDisplay}
              sx={{ my: 2 }}
              onChange={(e) => this.setState({ qIdDisplay: e.target.value })}
            >
              {Array(this.state.nQuestions).fill(1).map((_, i) => {
                return (
                  <MenuItem value={i}>{i + 1}</MenuItem>
                )
              })}
            </Select>
            {this.state.feedback.map((fb) => {
              return (
                <Card hidden={fb.QuestionId != this.state.qIdDisplay} sx={{ my: 1 }}>
                  <CardContent>
                    <Grid justifyContent="space-between" container spacing={2}>
                      <Grid item>
                        <Typography variant="h6">
                          {fb.Text}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={(e) => this.deleteFeedback(e, fb.Id)}><DeleteIcon /></IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        </Grid>
      </Grid>
    )
  };
}

export default Feedback