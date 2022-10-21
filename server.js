require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./src/app');
const { port, db } = require('./src/config');

// making connection into mongodb
mongoose.connect(db.dev.uri)
  .then(() => { console.info('database connected'); })
  .catch((err) => { console.error(err); });

app.listen(port, () => {
  // later move all console into logger
  console.info(`server running on port ${port}`);
});
