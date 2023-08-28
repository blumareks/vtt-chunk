// get express

const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(4000)


// get text
// manipulate 0-n overlap
// spit json with chunks
