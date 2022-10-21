require('dotenv').config();
const express = require('express');

const routes = require('./routes');
const { api } = require('./config');

const app = express();

// parser
app.use(express.json());

// root
app.get('/', (req, res, next) => { res.json({ message: 'root' }); });

// routes for api
app.use(api.path, routes);

// error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// change into profer error handler
app.use((err, req, res, next) => {
  const data = {};
  data.message = err.message;
  if (!err.isOperational) {
    console.error(err);
    data.message = 'Internal Server Error';
  }
  res.status(err.statusCode || 500).json(data);
});

module.exports = app;
