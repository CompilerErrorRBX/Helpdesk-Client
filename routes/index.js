const axios = require('axios');
const formidable = require('express-formidable');

const authentication = require('../controllers/authenticationController');
const users = require('../controllers/userController');
const tickets = require('../controllers/ticketsController');
const comments = require('../controllers/commentsController');
const roles = require('../controllers/rolesController');

const appRouter = (router) => {
  router.use((req, res, next) => {
    const request = req;
    request.query.limit = req.query.limit || 10;
    request.query.offset = req.query.offset || 0;

    if (request.headers.authorization) {
      axios.defaults.headers.common.Authorization = request.headers.authorization;
    }

    next();
  });

  // Authorization routes
  router.post('/login', authentication.Login);
  router.post('/register', authentication.Register);
  router.post('/authenticate', authentication.Authenticate);

  // User routes
  router.post('/pictureUpload', formidable(), users.FileUpload);
  router.get('/users', users.Users);
  router.get('/users/search', users.UserSearch);
  router.get('/user/:user', users.User);
  router.get('/user/:username/data', users.UserData);
  router.post('/user/:username/addRole/:role', users.UserAddRole);
  router.patch('/user', users.Update);

  // Tickets routes
  router.get('/tickets', tickets.Tickets);
  router.get('/tickets/:ticketId/:ticketName', tickets.Ticket);
  router.post('/tickets', tickets.CreateTicket);
  router.get('/ticket/:ticketId/comments', tickets.TicketComments);
  router.get('/ticket/:ticketId/technicians', tickets.TicketTechnicians);
  router.post('/ticket/:ticketId/comment', tickets.SubmitComment);
  router.post('/ticket/:ticketId/technician', tickets.AddTechnician);
  router.post('/ticket/:ticketId/status/:status', tickets.UpdateStatus);
  router.post('/ticket/:ticketId/description', tickets.UpdateDescription);

  // Comment routes
  router.patch('/comment/:commentId', comments.UpdateComment);
  router.delete('/comment/:commentId', comments.DeleteComment);

  // Roles routes
  router.get('/roles', roles.Roles);
};

module.exports = appRouter;
