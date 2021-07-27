const axios = require('axios');

const HelpdeskServiceURI = 'http://127.0.0.1:8080';

module.exports = {
  // PATCH api/comment/:commmentId
  UpdateComment(req, res, next) {
    axios.patch(`${HelpdeskServiceURI}/comment/${req.params.commentId}`, req.body).then((result) => {
      res.status(202).send(result.data);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // DELETE apo/comment/:commentId
  DeleteComment(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          mutation {
            commentDestroy(id: "${req.params.commentId}") {
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
};
