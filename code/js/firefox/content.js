/* global self */
/* exported storageSet, storageGet, getURL */

var simpleStorage = {};

function storageSet(key, value) {
  self.port.emit('update-storage', [key, value]);
}

function storageGet(key, cb) {
  self.port.emit('read-storage');
  cb(simpleStorage);
}

self.port.on('storage', function(storage) {
  simpleStorage = storage;
});

function getURL(asset) {
  return asset;
}
