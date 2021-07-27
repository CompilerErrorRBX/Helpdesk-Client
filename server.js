const express = require('express');
const methodOverride = require('method-override');

const app = express();
app.use(methodOverride());
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

require('dotenv').config()
require('./routes')(app);

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  const host = server.address().address === '::' ? 'localhost' : server.address().address;
  // eslint-disable-next-line no-console
  console.log('oofd-server Started and Running at http://%s:%s', host, port);
});
