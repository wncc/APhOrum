import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      message: ""
    };
  }

  componentDidMount() {
    fetch("http://localhost:8080/hello", {
        crossDomain: true,
        method: 'GET'
      }).then(res => res.text())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            message: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, message } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        message
      );
    }
  }
}

export default App;
