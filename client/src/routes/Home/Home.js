import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

export default class Home extends React.Component {
  state = {
    speech: null
  }
  componentDidMount() {}
  handleChange = event => {
    this.setState({ speech: event.target.value })
  }
  handleSubmit = event => {
    const { speech } = this.state

    fetch('http://localhost:3001', {
      method: 'POST',
      body: JSON.stringify({ speech })
    })
    .then(response => {
      return response.json()
    })
    .then(result => console.log(result))
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <textarea type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
