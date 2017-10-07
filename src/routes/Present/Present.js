import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Webcam from 'react-webcam'

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

export default class Present extends Component {
  componentDidMount() {
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
          console.log(result[0].scores)
        }
      })
    }, 1000)
  }
  handleUserMedia = () => {

  }
  render() {
    return (
      <div>
      <Webcam
        ref={component => this._webcam = component}
        height={window.outerHeight}
        screenshotFormat={'image/jpeg'}
        onUserMedia={this.handleUserMedia} />
      </div>
    )
  }
}
