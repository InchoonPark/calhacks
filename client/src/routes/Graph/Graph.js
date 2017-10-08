import React, { Component } from 'react'
import { Pie } from 'react-chartjs-2'

const sentimentData = {
  happiness: 4,
  neutral: 6,
  sadness: 2,
  surprise: 3
}
const data = {
	labels: [
		'Red',
		'Green',
		'Yellow'
	],
	datasets: [{
		data: [300, 50, 100],
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
  render() {
    return (
      <div className='graph-container'>
        <h2>Pie Example</h2>
        <Pie data={data} />
      </div>
    )
  }
}
