'use strict'

import React, { Component } from 'react'

import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import Bulletin from './Bulletin.js'
import FileIO from './Files.js'

function TabPanel(props) {
  const { children, hidden, ...other } = props;

  return (
    <div role="tabpanel" hidden={hidden} {...other} >
      <Box sx={{ p: 3 }}> {children} </Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  hidden: PropTypes.bool.isRequired,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.components = [
      ['Bulletin', Bulletin],
      ['Files', FileIO]
    ];
    this.state = { value: 'Bulletin' };
  }

  handleChange = (_, newValue) => {
    this.setState({ value: newValue });
  }

  render() {
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={this.state.value} onChange={this.handleChange}>
            {this.components.map(([name, _]) => {
              return (
                <Tab key={name} value={name} label={name} />
              )
            })}
          </Tabs>
        </Box>
        {this.components.map(([name, TabComponent]) => {
          return (
            <TabPanel key={name} hidden={(name !== this.state.value)}>
              <TabComponent />
            </TabPanel>
          )
        })}
      </Box>
    );
  }
}

export default App
