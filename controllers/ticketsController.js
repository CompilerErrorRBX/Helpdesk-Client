const axios = require('axios');

const HelpdeskServiceURI = 'http://127.0.0.1:8080';

module.exports = {
  // GET api/tickets
  Tickets(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          {
            jobs(limit: ${req.query.limit}, offset: ${req.query.offset}) {
              totalResults
              items {
                id title name status createdAt
                requester {
                  id firstName lastName
                }
                technicians {
                  picture id
                }
                comments {
                  id
                }
              }
              moreResults
            }
          }
        `,
      },
    ).then((result) => {
      res.status(200).send(result.data.data.jobs);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // GET api/ticket/:ticketId
  Ticket(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          {
            jobs(id: ${req.params.ticketId}, name: "${req.params.ticketName}") {
              items {
                id title status bounty description createdAt
                requester {
                  id firstName lastName email username picture
                  roles {
                    role
                  }
                }
              }
            }
          }
        `,
      },
    ).then((result) => {
      res.status(200).send(result.data.data.jobs.items[0]);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // GET api/ticket/:ticketId/comments
  TicketComments(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          {
            comments(jobId: ${req.params.ticketId}, limit: ${req.query.limit}, offset: ${req.query.offset}, orderBy: "-createdAt") {
              totalResults
              items {
                id commenterId body createdAt
                commenter {
                  id firstName lastName email username picture
                  roles {
                    role
                  }
                }
              }
              moreResults
            }
          }
        `,
      },
    ).then((result) => {
      res.status(200).send(result.data.data.comments);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // GET api/ticket/:ticketId/technicians
  TicketTechnicians(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          {
            users(jobId: ${req.params.ticketId}, role: "Technician,Admin") {
              totalResults
              items {
                id firstName lastName email username picture
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
      res.status(200).send(result.data.data.users.items);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // POST api/ticket/:ticketId/comment
  SubmitComment(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/job/${req.params.ticketId}/comment`, req.body).then((result) => {
      res.status(201).send(result.data);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // POST api/ticket/
  CreateTicket(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/jobs`, req.body).then((result) => {
      res.status(201).send(result.data);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // POST api/ticket/:ticketId/technician
  AddTechnician(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          mutation {
            jobTechnicianAdd(jobId: ${req.params.ticketId}) {
              id firstName lastName picture
              roles {
                role
              }
            }
          }
        `,
      },
    ).then((result) => {
      res.status(202).send(result.data.data);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // POST api/ticket/:ticketId/status/:status
  UpdateStatus(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          mutation {
            jobUpdate(id: ${req.params.ticketId}, status: "${req.params.status}") {
              id title status bounty description createdAt
              requester {
                id firstName lastName email username picture
                roles {
                  role
                }
              }
            }
          }
        `,
      },
    ).then((result) => {
      res.status(202).send(result.data.data);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // POST api/ticket/:ticketId/description
  UpdateDescription(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          mutation {
            jobUpdate(id: ${req.params.ticketId}, description: "${encodeURI(req.body.description)}") {
              id title status bounty description createdAt
              requester {
                id firstName lastName email username picture
                roles {
                  role
                }
              }
            }
          }
        `,
      },
    ).then((result) => {
      res.status(202).send(result.data.data);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },
};
