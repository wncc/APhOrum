'use strict'

import React, { Component } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
      json.forEach(message => {
        messages.push(message)
      })
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
      console.log('Output:', json);
      this.setState({ m: '' })
      this.updateMessage();
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  render() {
    return (
      <Box>
        <Box component="form" novalidate autoComplete="off" onSubmit={this.handleSubmit}>
          <TextField onChange={(event) => this.setState({ m: event.target.value })} value={this.state.m} id="apho_message" label="Bulletin Message" variant="outlined" />
          <Button variant="contained" type="submit">Submit</Button>
        </Box>
        <Box>
          {this.state.messages.map(message => {
            return (
              <Card>
                <CardContent>
                  <Typography variant="body2">
                    {message.Message}
                  </Typography>
                </CardContent>
              </Card>
            )
          })}
        </Box>
      </Box>
    )
  };
}

export default Bulletin