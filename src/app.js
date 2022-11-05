require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const apiDoc = require('../docs');

const routes = require('./routes');
const { api } = require('./config');

const app = express();

// add cors
const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root
app.get('/', (req, res, next) => { res.json({ message: 'root' }); });

// documentation
// app.use(`${api.path}/documentation`, swaggerUi.serve, swaggerUi.setup(apiDoc));

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
