const request = require('supertest');
const apiPath = require('../src/config').api.path;

module.exports.postData = async (path, data, server, options = {}) => {
  const { authorization } = options;
  if (authorization) {
    return request(server)
      .post(`${apiPath}${path}`)
      .send(data)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('authorization', authorization);
  }
  return request(server)
    .post(`${apiPath}${path}`)
    .send(data)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
};

module.exports.putData = async (path, data, server, options = {}) => {
  const { authorization } = options;
  if (authorization) {
    return request(server)
      .put(`${apiPath}${path}`)
      .send(data)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('authorization', authorization);
  }
  return request(server)
    .put(`${apiPath}${path}`)
    .send(data)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
};
module.exports.deleteData = async (path, data, server, options = {}) => {
  const { authorization } = options;
  if (authorization) {
    return request(server)
      .delete(`${apiPath}${path}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('authorization', authorization);
  }
  return request(server)
    .delete(`${apiPath}${path}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
};

module.exports.getData = async (path, data, server, options = {}) => {
  const { authorization } = options;
  if (authorization) {
    return request(server)
      .get(`${apiPath}${path}`)
      .set('authorization', authorization)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
  }
  return request(server)
    .get(`${apiPath}${path}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
};

// module.exports.formRequest = async (path, data, server, options) => {
//   const { authorization, method } = options;

//   const setMethod = (methodName, req2, data2 = null) => {
//     if (methodName === 'get') return req2.get(`${apiPath}${path}`);
//     if (methodName === 'post') {
//       return req2
//         .post(`${apiPath}${path}`)
//         .send(data2);
//     }
//     if (methodName === 'put') return req2.put(`${apiPath}${path}`);
//     if (methodName === 'delete') return req2.delete(`${apiPath}${path}`);
//     return 'wrong method';
//   };
//   let req = request(server);
//   req = setMethod(method, req);
//   if (authorization) { req.set('authorization', authorization); }
//   req = req
//     .set('Accept', 'application/json')
//     .set('Content-Type', 'application/json');

//   return req;
// };
