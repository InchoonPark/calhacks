import React, { Component } from 'react';
import {
  Redirect
} from 'react-router-dom'
import { Mic, Square } from 'react-feather'
import './styles.css'
import makeblob from './makeblob'
var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr

const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation)

export default class Present extends Component {
  state = {
    elapsed: 0,
    recording: false,
    emotion: 'neutral',
    wpm: 0,
    fillers: 0,
    redirect: false
  }
  async componentDidMount() {
    this._wpms = {}
    this._emotions = {}
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
  componentWillUnmount() {
    clearInterval(this._timerInterval)
    clearInterval(this._canvasInterval)
  }
  handleRecord = () => {
    const { recording } = this.state

    this.setState({ recording: true })

    this._timerInterval = setInterval(() => {
      this.setState({ elapsed: this.state.elapsed + 1 })
    }, 1000)

    this._recognizer.Recognize(event => {
      const { name } = event

      if(name === 'SpeechSimplePhraseEvent') {
        const { DisplayText, Duration, Offset } = event.result
        const words = DisplayText.toLowerCase().split(' ')
        let fillers = 0;
        for(let i = 0; i < words.length; i++) {
            if(words[i] === 'uh' || words[i] === 'um') {
              fillers++
            }
        }
        const wpm = Math.round(words.length / (Duration / 60) * 10000000)
        this._wpms[Offset / 10000000] = wpm
        this.setState({ wpm })
        this.setState({ fillers: this.state.fillers + fillers })
      }

      if(name === 'RecognitionEndedEvent') {
        this.setState({ redirect: true })
      }
    })
    .On(() => {
      console.log('swag')
    },
    (error) => {
      console.error(error);
    })
    this._canvasInterval = setInterval(() => {
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
        if(result.length !== 0) {
          const maxScore = Math.max(...Object.values(result[0].scores))

          Object.entries(result[0].scores).map(([key, value]) => {
            if(value === maxScore) {
              this.setState({ emotion: key})
              if(this._emotions[key]) {
                this._emotions[key]++
              } else {
                this._emotions[key] = 1
              }
              return
            }
          })
        }
      })
    }, 2000)
  }
  handleEnd = () => {
    this.setState({ redirect: true })
  }
  render() {
    const { recording, elapsed, wpm, emotion, fillers } = this.state
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0')
    const seconds = (elapsed % 60).toString().padStart(2, '0')

    if(this.state.redirect) {
      return (
        <Redirect to={{
          pathname: '/graph',
          state: {
            wpms: this._wpms,
            emotions: this._emotions,
            fillers,
          }
        }}/>
      )
    }

    return (
      <div className='container'>
        <h1 className='logo'>Stage Hand</h1>
        <ToastContainer ref={(input) => {this.container = input;}}
          toastMessageFactory={ToastMessageFactory}
          className="toast-top-right"
          preventDuplicates="true" />
        <video autoPlay muted={true} className='video'></video>
        <canvas width={window.outerWidth} height={window.outerHeight} style={{display: 'none'}}/>
        {recording &&
          <div>
            <div className='stats-container'>
              <div className='stat'>
                <h4 className='stat-title'>Emotion</h4>
                <p className='stat-item emotion-item'>{emotion}</p>
              </div>
              <div className='stat'>
                <h4 className='stat-title'>WPM</h4>
                <p className='stat-item'>{wpm}</p>
              </div>
              <div className='stat'>
                <h4 className='stat-title'>Fillers</h4>
                <p className='stat-item'>{fillers}</p>
              </div>
            </div>
            <div className='timer-container'>
              <h3 className='timer'>{minutes}:{seconds}</h3>
            </div>
          </div>
        }
        <button className='record-btn' onClick={() => {
            if(recording) {
              this.handleEnd()
            } else {
              this.handleRecord()
            }
          }}>
          {recording ?
            <Square color={'white'} size={30} />
            :
            <Mic color={'white'} size={30} />
          }
        </button>
      </div>
    )
  }
}
