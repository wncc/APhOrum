'use strict';

const {
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button
} = MaterialUI;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

class Bulletin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], m: '' };
  }

  updateMessage() {
    let messages = [];

    fetch('/bulletin', {
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
    fetch('/bulletin', {
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

class Navigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }

  handleChange = (_, newValue) => {
    this.setState({ value: newValue });
  }

  render() {
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={this.state.value} onChange={this.handleChange}>
            <Tab label="Bulletin" {...a11yProps(0)} />
            <Tab label="Files" {...a11yProps(1)} />
            <Tab label="Feedback" {...a11yProps(2)} />
            <Tab label="Polls" {...a11yProps(3)} />
            <Tab label="Translation" {...a11yProps(4)} />
            <Tab label="Marking" {...a11yProps(5)} />
          </Tabs>
        </Box>
        <TabPanel value={this.state.value} index={0}>
          <Bulletin></Bulletin>
        </TabPanel>
        <TabPanel value={this.state.value} index={1}>
          Files
        </TabPanel>
        <TabPanel value={this.state.value} index={2}>
          Feedback
        </TabPanel>
        <TabPanel value={this.state.value} index={3}>
          Polls
        </TabPanel>
        <TabPanel value={this.state.value} index={4}>
          Translation
        </TabPanel>
        <TabPanel value={this.state.value} index={5}>
          Marking
        </TabPanel>
      </Box>
    );
  }
}

export { Navigator }