// event emitter for message passing
var EE2 = require('eventemitter2').EventEmitter2;

// tab id is increased every second .connect()
var counter = 0;
var tabId = 1;

//
// chrome.runtime.Port
//

// event factory
function createEvent(bus, name) {
  return {
    addListener: function(callback) { bus.on(name, callback); },
    removeListener: function(callback) { bus.removeListener(name, callback); }
  };
}

function Port(info, bus, myPrefix, otherPrefix) {
  // public properties
  this.name = info && info.name;
  if ('A' === myPrefix) { // on that will be passed to onConnect
    this.sender = { tab: { id: tabId } };
    if (counter++ & 1) { tabId++; }
    if ('dt' === this.name) { this.sender = {}; }  // developer tools
  }
  // disconnect
  this.disconnect = function() {
    setImmediate(bus.emit.bind(bus, otherPrefix + 'disconnect'));
  };
  this.onDisconnect = createEvent(bus, myPrefix + 'disconnect');
  // postMessage
  this.postMessage = function(msg) {
    // msg should be serializable (so that it can be passed accross process
    // boundaries). we create a deep copy of it using JSON, so that we know that
    // the message we pass is unique in each context we pass it into  (even if
    // we send the same message (or with the same deep references) over and over
    // again to multiple destinations).
    var _str = JSON.stringify({ data: msg });
    var _obj = JSON.parse(_str);
    setImmediate(bus.emit.bind(bus, otherPrefix + 'message', _obj.data));
  };
  this.onMessage = createEvent(bus, myPrefix + 'message');
}

//
// chrome.runtime.(connect/onConnect):
//

// event dispatcher for chrome.runtime
var server = new EE2();

// exported
module.exports.runtime = {

  onConnect: {
    addListener: function(callback) { server.on('connect', callback); },
    removeListener: function(callback) { server.removeListener('connect', callback); }
  },

  connect: function() {
    // process args:
    var id = arguments[0], info = arguments[0];
    if (typeof(id) === 'string') { info = arguments[1]; }  // id provided
    else { id = undefined; } // id not provided
    // shared event bus for two communicating Ports
    var bus = new EE2();
    var portA = new Port(info, bus, 'A', 'B');
    var portB = new Port(info, bus, 'B', 'A');
    // let the port register onMessage --> setImmediate()
    setImmediate(server.emit.bind(server, 'connect', portA));
    return portB;
  },

  // for unit tests only
  __resetTabId: function(val) { val = val || 1; tabId = val; counter = 0; }

};
