const axios = require('axios');
const Records = require('./recordController');

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
                replies {
                  id commenterId body createdAt
                  commenter {
                    id firstName lastName email username picture
                    roles {
                      role
                    }
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

  // GET api/ticket/:ticketId/records
  TicketRecords(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          {
            records(jobId: ${req.params.ticketId}, limit: ${req.query.limit}, offset: ${req.query.offset}, orderBy: "-createdAt") {
              totalResults
              items {
                id description createdAt
                user {
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
      res.status(200).send(result.data.data.records);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // GET api/ticket/:ticketId/labels
  TicketLabels(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          {
            labels(jobId: ${req.params.ticketId}, limit: ${req.query.limit}, offset: ${req.query.offset}, orderBy: "-createdAt") {
              totalResults
              items {
                id label createdAt
              }
              moreResults
            }
          }
        `,
      },
    ).then((result) => {
      res.status(200).send(result.data.data.labels);
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
      Records.CreateRecord(req, 'Added a comment.');
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
      Records.CreateRecord(req, 'Assigned himself as a `Technician`.');
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // POST api/ticket/:ticketId/labels
  AddLabels(req, res, next) {
    const labels = encodeURI(req.body.labels.join(','));

    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          mutation {
            jobLabelsAdd(jobId: ${req.params.ticketId}, labels: "${labels}") {
              id
            }
          }
        `,
      },
    ).then((result) => {
      res.status(201).send(result.data.data);
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },

  // DELETE api/ticket/:ticketId/label/:label
  RemoveLabel(req, res, next) {
    axios.post(`${HelpdeskServiceURI}/api`,
      {
        query: `
          mutation {
            jobLabelRemove(jobId: ${req.params.ticketId}, label: "${req.params.label}") {
              id label
            }
          }
        `,
      },
    ).then((result) => {
      res.status(202).send(result.data.data);
      Records.CreateRecord(req, `Removed a label: \`${req.params.label}\`.`);
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
      Records.CreateRecord(req, `Updated the status to \`${req.params.status}\`.`);
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
      Records.CreateRecord(req, 'Updated the ticket description.');
      next();
    }).catch(() => {
      res.status(500).send('Internal Server Error.');
      next();
    });
  },
};
