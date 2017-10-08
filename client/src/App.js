import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Present from './routes/Present'
import Graph from './routes/Graph'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Present}/>
          <Route exact path="/graph" component={Graph} />
        </div>
      </Router>
    )
  }
}

export default App;
