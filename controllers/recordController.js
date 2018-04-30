const axios = require('axios');

const HelpdeskServiceURI = 'http://127.0.0.1:8080';

module.exports = {
  CreateRecord(req, description) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          mutation {
            recordCreate(jobId: ${req.params.ticketId}, description: "${encodeURI(description)}") {
              id
            }
          }
        `,
      },
    );
  },
};
