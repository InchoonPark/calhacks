import React, { Component } from 'react'
import { Line, Pie } from 'react-chartjs-2'
import './styles.css'

const data = {
  labels: ['happiness', 'neutral', 'surprised'],
  datasets: [{
    data: [1, 5, 2],
    backgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56'
    ],
    hoverBackgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56'
    ]
  }]
}

export default class Graph extends Component {
  componentDidMount() {
    const { emotions } = this.props.location.state

    this._emotionData = {
    	labels: ['happiness', 'neutral', 'surprised'],
    	datasets: [{
    		data: [1, 5, 2],
    		backgroundColor: [
    		'#FF6384',
    		'#36A2EB',
    		'#FFCE56'
    		],
    		hoverBackgroundColor: [
    		'#FF6384',
    		'#36A2EB',
    		'#FFCE56'
    		]
    	}]
    }

  }
  render() {
    const { fillers, wpms } = this.props.location.state
    /*const wpmValues = Object.values(wpms)
    const averageWPM = wpmValues => wpmValues.reduce( ( p, c ) => p + c, 0 ) / wpmValues.length*/

    return (
      <div className='graph-container'>
        <h1 className='heading'>Results</h1>
        <div className='column-container'>
          <div className='graph-column'>
            <div className='filler-counter'>
              <h2 className='graph-title'>Average WPM</h2>
              <p className='subtitle'>Your average words per minute was {137} wpm. Great job!</p>
            </div>
            <div className='graph'>
              <h2 className='graph-title'>Emotion Analysis</h2>
              <Pie data={data}/>
            </div>
            <div className='filler-counter'>
              <h2 className='graph-title'>Filler Counter</h2>
              <h1 className='fillers'>{fillers}</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
