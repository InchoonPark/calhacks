import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Home from './routes/Home'
import Present from './routes/Present'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/present" component={Present}/>
        </div>
      </Router>
    )
  }
}

export default App;
