'use strict';

const http = require('http');
const moment = require('moment')
const socketIo = require('socket.io');
const onChange = require('on-change');

const schedules = {}
const lastSent = {}

function isRecent(port, interval) {
  if (lastSent[port]) {
    const duration = moment.duration(moment().diff(lastSent[port]), 'milliseconds')
    return duration <= interval
  }

  return false
}

/**
 * Send the proxified object to one (or more) socket(s).
 */
function emitUpdate(socket, proxifiedObject, options) {
  if (isRecent(options.port, options.minInterval)) {
    if (schedules[options.port]) {
      clearTimeout(schedules[options.port])
    }

    const newInterval = options.minInterval + 1
    schedules[options.port] = setTimeout(_ => emitUpdate(socket, proxifiedObject, options), newInterval)
  } else {
    socket.emit('update', proxifiedObject);
    lastSent[options.port] = moment()
  }
}

/**
 * Open a socket.io server and send updates to connected clients
 * when a specific object suffer changes in one or more properties.
 *
 * @param {number} port The port to open the HTTP socket server
 * @param {object} initialObject The default value for the object to be proxified
 * @param {number} minInterval Prevents the socket to flood changes in case of many object changes
 */
function createProxifiedObjectSocket(options = {
  port: 8181,
  minInterval: 1000,
  initialObject: {},
}) {
  const server = http.createServer();
  const io = socketIo(server);

  // Start the socket server
  server.listen(options.port);

  io.on('connection', socket => emitUpdate(socket, proxifiedObject, options));
  const proxifiedObject = onChange(options.initialObject, () => emitUpdate(io.sockets, proxifiedObject, options));

  return proxifiedObject;
}

module.exports = createProxifiedObjectSocket;
