const app = require('./src/app');
const { port } = require('./src/config');

app.listen(port, () => {
  // later move all console into logger
  console.info(`server running on port ${port}`);
});
