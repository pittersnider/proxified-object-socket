'use strict';

const http = require('http');
const socketIo = require('socket.io');
const onChange = require('on-change');

/**
 * Send the proxified object to one (or more) socket(s).
 */
function emitUpdate(socket, proxifiedObject) {
  socket.emit('update', proxifiedObject);
}

/**
 * Open a socket.io server and send updates to connected clients
 * when a specific object suffer changes in one or more properties.
 *
 * @param {number} port The port to open the HTTP socket server
 * @param {object} initialObject The default value for the object to be proxified
 */
function createProxifiedObjectSocket(options = {
  port: 8181,
  initialObject: {},
}) {
  const server = http.createServer();
  const io = socketIo(server);

  // Start the socket server
  server.listen(options.port);

  io.on('connection', socket => emitUpdate(socket, proxifiedObject));
  const proxifiedObject = onChange(options.initialObject, () => emitUpdate(io.sockets, proxifiedObject));

  return proxifiedObject;
}

module.exports = createProxifiedObjectSocket;
