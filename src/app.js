const express = require('express');

const routes = require('./routes');
const { api } = require('./config');

const app = express();

// parser
app.use(express.json());

// routes
app.use(api.path, routes);

// error handler
// change into profer error handler
app.use((err, req, res, next) => {
  console.error(err);
});

module.exports = app;
