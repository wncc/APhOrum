'use strict'

import React, { Component } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Pagination from '@mui/material/Pagination'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import * as markerjs2 from 'markerjs2'

import config from './config.json'

class Marking extends Component {
  constructor(props) {
    super(props);
    this.state = { n: 3, i: 1 };
    this.state.annotationData = Array(this.state.n).fill(1).map((_, i) =>
      require("../../data/img" + (i + 1).toString() + ".jpg").default);
    this.state.marksData = Array(this.state.n).fill(0);
  }

  showMarkerArea = (event, i) => {
    const _ic = event.target;
    var ad = this.state.annotationData;
    if (_ic) {
      const markerArea = new markerjs2.MarkerArea(_ic)
      markerArea.addEventListener("render", (event) => {
        if (_ic) _ic.src = event.dataUrl
        ad[i] = event.dataUrl
        this.setState({ annotationData: ad })
      })
      markerArea.show()
    }
  }

  handleSubmit = () => {
    const formData = new FormData();
    formData.append('marksData', JSON.stringify(this.state.marksData))
    formData.append('annotationData', JSON.stringify(this.state.annotationData))

    fetch(config.BACKEND_URL + '/paper/marks', {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) return response.json()
    }).then(() => {
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  componentDidMount() {
    fetch(config.BACKEND_URL + '/paper/marks', {
      method: 'GET'
    }).then(response => {
      if (response.ok) return response.json()
    }).then((json) => {
      const ad = json.AnnotationData
      const md = json.MarksData
      if (ad)
        this.setState({ annotationData: JSON.parse(ad) })
      if (md)
        this.setState({ marksData: JSON.parse(md) })
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  changeMarks = (event, i) => {
    var md = this.state.marksData
    md[i] = event.target.value
    this.setState({ marksData: md })
  }

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Pagination
            sx={{ my: 2 }}
            page={this.state.i}
            onChange={(_, np) => this.setState({ i: np })}
            count={this.state.n}
          />
          {Array(this.state.n).fill(1).map((_, i) => {
            return (
              <Card hidden={i + 1 != this.state.i}>
                <CardMedia
                  component="img"
                  src={this.state.annotationData[i]}
                  onClick={(e) => this.showMarkerArea(e, i)}
                />
              </Card>
            )
          })}
          <Box sx={{ mt: 2 }}><Button variant="contained" onClick={this.handleSubmit}>Save</Button></Box>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" sx={{ mb: 2 }}>Marks Entry</Typography>
          {Array(this.state.n).fill(1).map((_, i) => {
            return (
              <Box sx={{ my: 2 }}>
                <TextField
                  onChange={(e) => this.changeMarks(e, i)}
                  value={this.state.marksData[i]}
                  label={"Question " + (i + 1).toString()}
                  variant="outlined"
                />
              </Box>
            )
          })}
          <Box sx={{ mt: 2 }}><Button variant="contained" onClick={this.handleSubmit}>Save</Button></Box>
        </Grid>
      </Grid>
    )
  };
}

export default Marking