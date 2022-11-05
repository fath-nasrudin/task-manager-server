require('dotenv').config();

module.exports = {
  node: {
    env: process.env.NODE_ENV || 'development',
  },
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    exp: process.env.JWT_EXP,
    iss: process.env.JWT_ISS,
  },
  api: {
    path: process.env.API_PATH || '/api/v1',
  },
  db: {
    test: {
      uri: process.env.MONGODB_URI_TEST,
    },
    dev: {
      uri: process.env.MONGODB_URI_DEV,
    },
    prod: {
      uri: process.env.MONGODB_URI_PROD,
    },
  },
};
