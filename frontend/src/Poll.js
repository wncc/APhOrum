'use strict'

import React, { Component } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import DeleteIcon from '@mui/icons-material/Delete'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import config from './config.json'

class Vote extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <RadioGroup value={this.props.voteOption} onChange={(e) => this.props.onOptionChange(e.target.value)}>
        {this.props.options.map((option, i) => {
          return (
            <FormControlLabel value={i} label={option} control={<Radio />} />
          )
        })
        }</RadioGroup>
    )
  }
}

class Poll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pollTextUp: '',
      options: [],
      pollTextDown: '',
      optionsDown: [],
      pollIdDown: '',
      voteOption: 0,
      pollResults: []
    };
  }

  addOption = () => {
    var options = this.state.options
    options.push("")
    this.setState({ options: options })
  }

  changeOption = (event, i) => {
    var options = this.state.options
    options[i] = event.target.value
    this.setState({ options: options })
  }

  deleteOption = (_, i) => {
    var options = this.state.options
    options.splice(i, 1)
    this.setState({ options: options })
  }

  sendPoll = () => {
    const formData = new FormData();
    formData.append('pollId', (new Date()).getTime().toString())
    formData.append('question', this.state.pollTextUp)
    formData.append('options', this.state.options)

    fetch(config.BACKEND_URL + '/poll', {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) return response.json()
    }).then(() => {
      this.setState({ pollTextUp: '', options: [] })
      this.getActivePolls();
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  getActivePolls = () => {
    fetch(config.BACKEND_URL + '/poll', {
      method: 'GET'
    }).then(response => {
      if (response.ok) return response.json()
    }).then((json) => {
      if (json != null) {
        this.setState({ pollIdDown: json.Id, pollTextDown: json.Title, optionsDown: json.Options })
      } else {
        this.setState({ pollIdDown: '', pollTextDown: '', optionsDown: [] })
      }
      this.getPollResults();
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  componentDidMount() {
    this.getActivePolls();
  }

  sendVote = () => {
    const formData = new FormData();
    formData.append('pollId', this.state.pollIdDown)
    formData.append('option', this.state.voteOption)

    fetch(config.BACKEND_URL + '/poll/vote', {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) return response.json()
    }).then(() => {
      this.getPollResults();
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  getPollResults = () => {
    fetch(config.BACKEND_URL + '/poll/vote/' + this.state.pollIdDown, {
      method: 'GET'
    }).then(response => {
      if (response.ok) return response.json()
    }).then((json) => {
      if (json != null) {
        this.setState({ pollResults: json })
      } else {
        this.setState({ pollResults: [] })
      }
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  closePoll = () => {
    fetch(config.BACKEND_URL + '/poll/close/' + this.state.pollIdDown, {
      method: 'GET'
    }).then(response => {
      if (response.ok) return response.json()
    }).then(() => {
      this.getActivePolls()
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h4" sx={{ mb: 2 }}>Create a Poll</Typography>
          <TextField
            multiline
            fullWidth
            onChange={(e) => this.setState({ pollTextUp: e.target.value })}
            value={this.state.pollTextUp}
            label="Poll Question"
            variant="outlined"
          />
          <Box>
            {this.state.options.map((option, i) => {
              return (
                <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
                  <Grid item xs={5}>
                    <TextField
                      sx={{ mt: 2 }}
                      fullWidth
                      onChange={(e) => this.changeOption(e, i)}
                      value={option}
                      label={"Option " + (i + 1).toString()}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={(e) => this.deleteOption(e, i)}><DeleteIcon /></IconButton>
                  </Grid>
                </Grid>
              )
            })}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
              <Grid item>
                <Button onClick={this.addOption} variant="contained" startIcon={<AddCircleIcon />}>Add Option</Button>
              </Grid>
              <Grid item>
                <Button onClick={this.sendPoll} variant="contained">Submit</Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" sx={{ mb: 2 }}>Vote</Typography>
          <Typography variant="h6">{this.state.pollTextDown}</Typography>
          <Vote options={this.state.optionsDown} voteOption={this.state.voteOption} onOptionChange={(v) => this.setState({ voteOption: v })} />
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
              <Grid item>
                <Button onClick={this.sendVote} variant="contained">Vote</Button>
              </Grid>
              <Grid item>
                <Button onClick={this.closePoll} variant="contained" endIcon={<DeleteIcon />}>Close</Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" sx={{ mb: 2 }}>Results</Typography>
          {this.state.pollResults.map((result, _) => {
            return (
              <Typography variant="h6">
                {this.state.optionsDown[result.Option]}: {result.Count}
              </Typography>
            )
          })}
        </Grid>
      </Grid >
    )
  };
}

export default Poll