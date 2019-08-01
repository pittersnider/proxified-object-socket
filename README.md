# Proxified Object Socket
Creates a Socket.IO server and broadcast an event automatically when a specific object has changed

```javascript
// Import the npm package
const objectSocket = require('proxified-object-socket');

// Open your socket and proxify the object
const myObject = objectSocket({
  port: 8181, // default port
  initialObject: {} // default object
});

/* At this moment, the socket is already opened.
 * If you change something on myObject,
 * The system will emit the event 
 * "update" to all connected sockets.
 *
 * See the example below.
 */
setInterval(function() {
  myObject.lastChangedAt = new Date();
  // The socket automatically detected the change
  // and submitted a new version of the object.
}, 1500);

// PS: when someone connects to the socket,
// we automatically send an "update" event just for (s)he.
```
