const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const api = require('./routes/api');

const app = express();

// create a log stream
const rfsStream = rfs.createStream("log.txt", {
   size: '10M', // rotate every 10 MegaBytes written
   interval: '1d', // rotate daily
   compress: 'gzip' // compress rotated files
})

app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(morgan('combined', {
  stream: rfsStream
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', api);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;