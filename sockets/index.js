const socketIO = require('socket.io');

let io = null;

function newSocket(server) {
  if (io) {
    return io;
  }
  io = socketIO(server, {
    pingInterval: 5000,
    pingTimeout: 5000,
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
    socket.on('new comment', (comment) => {
      socket.broadcast.emit('COMMENT', comment);
    });
  });
  return io;
}

module.exports = newSocket;
