require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    exp: process.env.JWT_EXP,
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
