
// server.js
const https = require('https');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('static'));
express.static.mime.define({'text/calendar': ['ics']});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app).listen(port, () => {
//     console.log(`listening on port ${port}`)
//   });



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
