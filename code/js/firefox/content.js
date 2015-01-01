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
  if (asset === 'images/algolia128x40.png') {
    return self.options.logoUrl;
  } else if (asset === 'images/close-16.png') {
    return self.options.closeImgUrl;
  } else {
    return asset;
  }
}
