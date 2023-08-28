// get express

const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Instructions:\n 1. use post to sumbit text in JSON: {"text":"some VTT"}');
})

app.post('/', function (req, res) {
  res.send({"text":"some VTT"});
})

app.listen(4000)


// get text
// manipulate 0-n overlap
// spit json with chunks
