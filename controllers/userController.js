const axios = require('axios');
const cloudinary = require('../cloudinary');

const HelpdeskServiceURI = 'http://127.0.0.1:8080';

module.exports = {
  // POST api/pictureUpload
  FileUpload(req, res, next) {
    const upload = req.files.upload;
    cloudinary.uploader.upload(
      upload.path,
      (result) => {
        axios.patch(`${HelpdeskServiceURI}/user`, { picture: result.secure_url }).then((response) => {
          res.status(202).send(response.data);
          next();
        }).catch(() => {
          res.status(500).send('Internal server error.');
          next();
        });
      },
      {
        crop: 'fill',
        width: 128,
        height: 128,
        quality: 80,
        gravity: 'face',
        tags: ['avatar'],
      },
    );
  },

  // GET api/users
  Users(req, res, next) {
    const queryParams = `?${Object.keys(req.query).map(q => `${q}=${req.query[q]}`).join('&')}`;
    axios.get(`${HelpdeskServiceURI}/users${queryParams}`).then((result) => {
      res.status(200).send(result.data);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // GET api/user/:user
  User(req, res, next) {
    axios.get(`${HelpdeskServiceURI}/user/${req.params.user}`).then((result) => {
      res.status(200).send(result.data);
      next();
    }).catch(() => {
      res.status(404).send('Could not find user');
      next();
    });
  },

  // PATCH api/user
  // Updates the currently authenticated user.
  Update(req, res, next) {
    axios.patch(`${HelpdeskServiceURI}/user`, req.body).then((result) => {
      res.status(202).send(result.data);
      next();
    }).catch(() => {
      res.status(404).send('Could not find user');
      next();
    });
  },

  // POST api/user/:username/addRole/:role
  UserAddRole(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          mutation {
            userAddRole(username: "${req.params.username}", role: "${req.params.role}") {
              id
            }
          }
        `,
      },
    ).then(() => {
      res.status(202).send('Success.');
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // GET api/users/search
  UserSearch(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          {
            users(query: "${req.query.query}", limit: ${req.query.limit}, offset: ${req.query.offset}) {
              totalResults
              items {
                id firstName lastName username picture email
                roles {
                  role
                }
              }
              moreResults
            }
          }
        `,
      },
    ).then((result) => {
      res.status(200).send(result.data.data.users);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // GET api/user/:username/data
  UserData(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          {
            users(username: "${req.params.username}") {
              items {
                id firstName lastName username picture email
                roles {
                  role
                }
                requests {
                  id title createdAt status name
                  requester {
                    id firstName lastName
                  }
                  technicians {
                    id
                  }
                  comments {
                    id
                  }
                }
                jobs {
                  id title createdAt status name
                  requester {
                    id firstName lastName
                  }
                  technicians {
                    id
                  }
                  comments {
                    id
                  }
                }
                comments {
                  id body createdAt
                }
                profile {
                  biography
                }
              }
            }
          }
        `,
      },
    ).then((result) => {
      res.status(200).send(result.data.data.users.items[0]);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },
};
