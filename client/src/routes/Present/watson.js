/*fetch('http://localhost:3001/watson-token')
.then(response => {
  return response.json()
})
.then(result => {
  console.log(result)
  const { token } = result
  const stream = recognizeMic({
    token: token,
    objectMode: true,
    extractResults: true,
    profanity_filter: true,
    format: false,
  })


  stream.on('data', data => {
    if(data.final === true) {
      console.log(data.alternatives[0].transcript)
    }
  })
})*/

/*try {
  const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
  const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })

  const video = document.querySelector('video');
  video.src = window.URL.createObjectURL(videoStream)

  const audioRecorder = new MediaRecorder(audioStream)
  let chunks = []

  audioRecorder.start()
  setTimeout(() => {
    audioRecorder.stop()
  }, 5000)

  audioRecorder.ondataavailable = event => {
    chunks.push(event.data)
  }

  audioRecorder.onstop = () => {
    const blob = new Blob(chunks, {
      type: 'audio/wav'
    })

    fetch(WATSON['url'], {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(WATSON['username'] + ':' + WATSON['password']),
        "Content-Type": "audio/wav",
        "Transfer-Encoding": "chunked"
      },
      body: blob
    })
    .then(response => {
      return response.json()
    })
    .then(result => {
      console.log(result)
    })
    .catch(error => {
      console.log(error)
    })
  }
} catch(error) {

}*/
