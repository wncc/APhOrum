'use strict'

import React, { Component } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import config from './config.json'

class Translation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nQuestions: 0,
      originalTexts: new Map(),
      translations: new Map(),
      translationLoading: false
    };
  }

  getCurrentTexts(i) {
    fetch(config.BACKEND_URL + '/paper/translate/' + i.toString(), {
      method: 'GET'
    }).then(response => {
      if (response.ok) return response.json()
    }).then(json => {
      const _ot = this.state.originalTexts
      const _tr = this.state.translations
      _ot[i] = json.EnglishText
      _tr[i] = json.TranslatedText
      this.setState({ originalTexts: _ot, translations: _tr })
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
      const _n = parseInt(json)
      this.setState({ nQuestions: _n })
      Array(_n).fill(1).forEach((_, i) => this.getCurrentTexts(i))
    }).catch(err => {
      console.log('Error:', err);
    })
  }

  handleTranslateSubmit = (event, id) => {
    event.preventDefault();
    fetch(config.BACKEND_URL + '/paper/translate', {
      method: 'POST',
      body: JSON.stringify({ 'id': id.toString(), 'translatedText': this.state.translations[id] }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) return response.json()
    }).then(() => {
      this.getCurrentTexts(id)
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  fetchTranslation = (event) => {
    event.preventDefault();
    this.setState({ translationLoading: true })
    fetch(config.BACKEND_URL + '/paper/translate/download', {
      method: 'GET',
    }).then(response => {
      if (response.ok) return response.blob()
    }).then((blob) => {
      this.setState({ translationLoading: false })
      const a = document.createElement("a")
      const href = window.URL.createObjectURL(blob)

      a.href = href; a.download = 'translated.pdf'; a.click(); a.remove()
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  render() {
    return (
      <Grid container spacing={2}>
        {Array(this.state.nQuestions).fill(1).map((_, i) => {
          return (
            <>
              <Grid item xs={12}><Typography variant="h5">Question {i + 1}</Typography></Grid>
              <Grid item xs={6}>
                <TextField
                  multiline
                  fullWidth
                  value={this.state.originalTexts[i]}
                  variant="outlined"
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <Box component="form" novalidate autoComplete="off" onSubmit={(e) => this.handleTranslateSubmit(e, i)}>
                  <TextField
                    multiline
                    fullWidth
                    onChange={(event) => {
                      const _tr = this.state.translations;
                      _tr[i] = event.target.value;
                      this.setState({ translations: _tr })
                    }}
                    value={this.state.translations[i]}
                    variant="outlined"
                  />
                  <Box sx={{ mt: 2 }}><Button variant="contained" type="submit">Submit Translation</Button></Box>
                </Box>
              </Grid>
            </>
          )
        })}
        <Grid item xs={12}>
          <Box component="form" novalidate autoComplete="off" onSubmit={this.fetchTranslation}>
            <Box sx={{ mt: 2 }}><Button disabled={this.state.translationLoading} variant="contained" type="submit">
              Get Translated Paper
            </Button></Box>
          </Box>
        </Grid>
      </Grid>
    )
  };
}

export default Translation