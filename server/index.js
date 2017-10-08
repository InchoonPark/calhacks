const express = require('express')
const cors = require('cors')
const watson = require('watson-developer-cloud')

const app = express()

app.use(cors({origin: 'http://localhost:3000'}))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/watson-token', function(req, res) {
  const authorization = new watson.AuthorizationV1({
    "url": "https://stream.watsonplatform.net/speech-to-text/api",
    "username": "fd7ec398-4f5b-4aad-9403-fb7d78680cc1",
    "password": "OtqL7mbhdX13"
  })

  authorization.getToken(function(error, token) {
    console.log(token)
    if(!token) {
      res.status(500).send({ error })
    } else {
      res.status(201).send({ token })
    }
  })
})

app.listen(3001, function () {
  console.log('Example app listening on port 3000!')
})
