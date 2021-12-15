'use strict'

import React, { Component } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import config from './config.json'

class Bulletin extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], m: '' };
  }

  updateMessage() {
    let messages = [];

    fetch(config.BACKEND_URL + '/bulletin', {
      method: 'GET'
    }).then(response => {
      if (response.ok) return response.json()
    }).then(json => {
      if (json === null)
        messages.push("No messages")
      else {
        json.forEach(message => {
          messages.push(message.Message)
        })
      }
      this.setState({ messages: messages }) // trigger rerender
    }).catch(err => {
      console.log('Error:', err);
    })
  }

  componentDidMount() {
    this.updateMessage();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    fetch(config.BACKEND_URL + '/bulletin', {
      method: 'POST',
      body: JSON.stringify({ 'message': this.state.m, 'expiry': Math.floor((new Date()).getTime() / 1e3) + 30 }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) return response.json()
    }).then(json => {
      this.setState({ m: '' })
      this.updateMessage();
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box component="form" novalidate autoComplete="off" onSubmit={this.handleSubmit}>
            <Typography variant="h4" sx={{ mb: 2 }}>Send a new message</Typography>
            <TextField
              multiline
              fullWidth
              onChange={(event) => this.setState({ m: event.target.value })} value={this.state.m}
              label="What is the message?"
              variant="outlined"
            />
            <Box sx={{ pt: 2 }}><Button variant="contained" type="submit">Submit</Button></Box>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box>
            <Typography variant="h4" sx={{ mb: 2 }}>Current messages</Typography>
            {this.state.messages.map(message => {
              return (
                <Card sx={{ my: 1 }}>
                  <CardContent>
                    <Typography variant="h6">
                      {message}
                    </Typography>
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

export default Bulletin