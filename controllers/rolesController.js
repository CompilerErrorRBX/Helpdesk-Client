const axios = require('axios');

const HelpdeskServiceURI = 'http://127.0.0.1:8080';

module.exports = {
  // GET api/roles
  Roles(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          {
            roles {
              items {
                role
              }
            }
          }
        `,
      },
    ).then((result) => {
      res.status(200).send(result.data.data.roles.items);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },
};
