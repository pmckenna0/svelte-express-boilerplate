const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.on('mount', function (parent) {
  console.log('Admin Mounted')
  console.log(parent) // refers to the parent app
})

const api = require('./api');
const { notFound, errorHandler } = require('./middlewares/errors.middleware');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/public'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
  });
}

app.use(express.json());
app.use(cors());

app.set('view engine', 'pug')

app.get('/pug', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.get('/md', (req, res) => {
  var markdown = require( "markdown" ).markdown;
  const fs = require('fs');
  fs.readFile(path.resolve(__dirname, 'README.md'), 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    res.send(markdown.toHTML(data));
  })
  
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: '📦 Svelte Express Boilerplate 📦' 
  });
});

app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler);

module.exports = app;