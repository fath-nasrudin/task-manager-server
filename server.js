require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./src/app');
const { port, db, node } = require('./src/config');

// set the db here. decide is the environment is production or anything else
let dbURI = null;
if (node.env === 'production') dbURI = db.prod.uri;
if (node.env === 'development') dbURI = db.dev.uri;

// making connection into mongodb
mongoose.connect(dbURI)
  .then(() => { console.info(`database connected on env ${node.env}`); })
  .catch((err) => { console.error(err); });

app.listen(port, () => {
  // later move all console into logger
  console.info(`server running on port ${port}`);
});
