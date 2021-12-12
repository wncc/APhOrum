'use strict';

const {
    Tabs,
    Tab,
    Box,
    Typography
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
          Bulletin
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