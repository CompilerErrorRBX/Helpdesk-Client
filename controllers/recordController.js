const axios = require('axios');

const HelpdeskServiceURI = process.env.HELPDESK_SERVER_URI;

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
