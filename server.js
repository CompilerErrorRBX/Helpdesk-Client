const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');
const socket = require('./sockets');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

socket(http);
routes(app);

const server = http.listen(3001, () => {
  console.log('Helpdesk client running on port', server.address().port);
});
