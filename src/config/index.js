module.exports = {
  port: process.env.PORT || 3000,
  jwt: {
    secret: 'cdaaptnia',
    exp: '30d',
  },
  api: {
    path: '/api/v1',
  },
  db: {
    test: {
      // uri: process.env.MONGDB_URI_TEST
      uri: 'mongodb://127.0.0.1/task-manager-test',
    },
    dev: {
      // uri: process.env.MONGDB_URI_TEST
      uri: 'mongodb://127.0.0.1/task-manager-dev',
    },
    prod: {
      // uri: process.env.MONGDB_URI_TEST
      uri: 'mongodb://127.0.0.1/task-manager-prod',
    },
  },
};
