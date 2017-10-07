const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({origin: 'http://localhost:3000'}))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/speech', function(req, res) {
  const { body } = req
  console.log(body)
  res.send(201)
})

app.listen(3001, function () {
  console.log('Example app listening on port 3000!')
})
