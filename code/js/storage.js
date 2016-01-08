/* global self, chrome */

var simpleStorage = {};
var firefox = typeof self !== 'undefined' && typeof self.port !== 'undefined';

module.exports = {
  set: function(key, value) {
    if (firefox) {
      self.port.emit('update-storage', [key, value]);
    } else {
      var v = {};
      v[key] = value;
      chrome.storage.local.set(v);
    }
  },

  get: function(key, cb) {
    if (firefox) {
      self.port.emit('read-storage');
      cb(simpleStorage);
    } else {
      chrome.storage.local.get(key, cb);
    }
  }
};
