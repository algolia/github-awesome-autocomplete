/* global window, self, chrome */

var simpleStorage = {};
var firefox = typeof self !== 'undefined' && typeof self.port !== 'undefined';

module.exports = {
  set: function(key, value) {
    if (firefox) {
      self.port.emit('update-storage', [key, value]);
    } else if (typeof chrome !== 'undefined') {
      var v = {};
      v[key] = value;
      chrome.storage.local.set(v);
    } else {
      window.localStorage.setItem(key, value);
    }
  },

  get: function(key, cb) {
    if (firefox) {
      self.port.emit('read-storage');
      cb(simpleStorage);
    } else if (typeof chrome !== 'undefined') {
      chrome.storage.local.get(key, cb);
    } else {
      cb(window.localStorage.getItem(key));
    }
  }
};
