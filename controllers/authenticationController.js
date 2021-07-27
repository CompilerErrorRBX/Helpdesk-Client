const axios = require('axios');

const HelpdeskServiceURI = 'http://127.0.0.1:8080';

module.exports = {
  // POST api/login
  Login(req, res, next) {
    axios.post(
      `${HelpdeskServiceURI}/auth/login`, {
        username: req.body.username,
        password: req.body.password,
      },
    ).then((result) => {
      res.status(202).send(result.data);
      next();
    }).catch(() => {
      res.status(400).send('Invalid Username or Password.');
      next();
    });
  },

  // POST api/register
  Register(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/auth/register`, req.body).then((result) => {
      res.status(201).send(result.data);
      next();
    }).catch((err) => {
      res.status(400).send(err);
      next();
    });
  },

  // POST api/authenticate
  Authenticate(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/auth/user`).then((result) => {
      res.status(202).send(result.data);
      next();
    }).catch(() => {
      res.status(401).send('Invalid Access Token.');
      next();
    });
  },
};
