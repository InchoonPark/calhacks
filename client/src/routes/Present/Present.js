import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { Mic } from 'react-feather'
import './styles.css'
import makeblob from './makeblob'
var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr

const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation)

export default class Present extends Component {
  state = {
    recording: false,
    currentEmotion: null
  }
  async componentDidMount() {
    window.Initialize(SDK => {
      this._recognizer = window.RecognizerSetup(SDK)
    })

    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })

      const video = document.querySelector('video');
      video.src = window.URL.createObjectURL(videoStream)
    } catch(error) {

    }
  }
  handleRecord = () => {
    this._recognizer.Recognize(event => {
      const { name } = event

      if(name === 'SpeechSimplePhraseEvent') {
        console.log(event)
      }
    })
    .On(() => {
      console.log('swag')
    },
    (error) => {
      console.error(error);
    })
    setInterval(() => {
      const video = document.querySelector('video');
      const canvas = document.querySelector('canvas')
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageUrl = canvas.toDataURL('image/png')
      const blob = makeblob(imageUrl)

      fetch('https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': '9a3e79b59a0848ea982145fb02407632'
        },
        body: blob
      })
      .then(response => {
        return response.json()
      })
      .then(result => {
        console.log(result)
        /*if(result.length !== 0) {
          this.container.success(
            "my-title",
            "my-fascinating-toast-message", {
            timeOut: 5000,
            extendedTimeOut: 3000
          })
          console.log(result[0].scores)
        }*/
      })
    }, 2000)
  }
  render() {
    const { recording } = this.state

    return (
      <div className='container'>
        <ToastContainer ref={(input) => {this.container = input;}}
          toastMessageFactory={ToastMessageFactory}
          className="toast-top-right"
          preventDuplicates="true" />
        <video autoPlay muted={true} className='video'></video>
        <canvas width={window.outerWidth} height={window.outerHeight} style={{display: 'none'}}></canvas>
        <div className='stats-container'>
          <div className='stat'>
            <h4 className='stat-title'>Emotion</h4>
            <p className='stat-item'>Swag</p>
          </div>
          <div className='stat'>
            <h4 className='stat-title'>WPM</h4>
            <p className='stat-item'>70</p>
          </div>
          <div className='stat'>
            <h4 className='stat-title'>Fillers</h4>
            <p className='stat-item'>1</p>
          </div>
        </div>
        <div className='timer-container'>
          <h3 className='timer'>00:32</h3>
        </div>
        <button className='record-btn' onClick={this.handleRecord}>
          <Mic color={'white'} size={30} />
        </button>
      </div>
    )
  }
}
