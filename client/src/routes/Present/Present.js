import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Webcam from 'react-webcam'
var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr

const makeblob = (dataURL) => {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation)

export default class Present extends Component {
  componentDidMount() {
    if (!('webkitSpeechRecognition' in window)) {
      console.log('upgrade')
    } else {
      this.recognition = new window.webkitSpeechRecognition()
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = event => {
        /*var final_transcript = '';

        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          }
        }*/
        console.log(event)
        console.log('Ended:' + event.timeStamp)
      }
      this.recognition.onspeechstart = event => {
        console.log('Started:' + event.timeStamp)
      }
      this.recognition.onerror = event => {
        console.log(event)
      }
    }


    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(stream => {
      const video = document.querySelector('video');
      video.src = window.URL.createObjectURL(stream)
      this.recognition.start()

      setInterval(() => {

        const canvas = document.querySelector('canvas')
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        document.querySelector('img').src = canvas.toDataURL('image/webp')
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
            this.container.success(
              "my-title",
              "my-fascinating-toast-message", {
              timeOut: 5000,
              extendedTimeOut: 3000
            })
            console.log(result[0].scores)
          }
        })
      }, 2000)
    })
    .catch(function(err) {
      /* handle the error */
    })
  }

  /*handleSwag = () => {
    console.log(this._webcam.audioSource)
    setInterval(() => {
      const imageSrc = this._webcam.getScreenshot()
      const blob = makeblob(imageSrc)

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
          this.container.success(
            "my-title",
            "my-fascinating-toast-message", {
            timeOut: 5000,
            extendedTimeOut: 3000
          })
          console.log(result[0].scores)
        }
      })
    }, 1000)
  }*/
  render() {
    return (
      <div>
        <ToastContainer ref={(input) => {this.container = input;}}
          toastMessageFactory={ToastMessageFactory}
          className="toast-top-right"
          preventDuplicates="true" />
        <video autoPlay width={500} height={300}></video>
        <img style={{width: 500, height: 300}} src=""/>
        <canvas width={500} height={300} style={{display: 'none'}}></canvas>
      </div>
    )
  }
}
