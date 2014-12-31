/* global chrome */
/* exported storageSet, storageGet, getURL */

function storageSet(key, value) {
  var v = {};
  v[key] = value;
  chrome.storage.local.set(v);
}

function storageGet(key, cb) {
  chrome.storage.local.set(key, cb);
}

function getURL(asset) {
  return chrome.extension.getURL(asset);
}
