const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
  const baseDir = process.env.BASE_DIR || './';

  // Serve any static files
  app.use(express.static(baseDir + 'build'));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(baseDir + 'build/index.html');
  });
}

module.exports = app;
