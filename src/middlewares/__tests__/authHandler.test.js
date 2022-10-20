jest.mock('../../utils');
const utils = require('../../utils');

const { authenticate, isAdmin } = require('../authHandler');

describe.skip('authHandler tests', () => {
  it('should have the module', () => {
    expect(authenticate).toBeDefined();
    expect(isAdmin).toBeDefined();
  });

  describe('authenticate middleware test', () => {
    it('should should failed if token not provided', async () => {
      // check is the generate error called

      const token = 'wrong token';
      const mockReq = () => {
        const req = {};
        req.headers.authorization = token;
        return req;
      };
      const mockRes = () => {
        const res = {};
        res.user = { name: 'test', email: 'test@fm.com', role: 'basic' };
        return res;
      };
      const mockedReq = mockReq;
      const mockedRes = mockRes;
      const mockedNext = jest.fn();

      const result = await authenticate(mockedReq, mockedRes, mockedNext);
      console.log(result);

      // expect(utils.generateHTTPError).toBeCalledTimes(5);
      // expect(error.statusCode).toBe(406);
    });
    //
    //
    // should failed if token start with not "Bearer "
    // should failed if token is invalid
    // should success if token is verified and in the right format
  });
});
