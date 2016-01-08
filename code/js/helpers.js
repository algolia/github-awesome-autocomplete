/* global self, chrome */

var firefox = typeof self !== 'undefined' && typeof self.port !== 'undefined';

module.exports = {
  getURL: function(asset) {
    if (firefox) {
      if (asset === 'images/algolia128x40.png') {
        return self.options.logoUrl;
      } else if (asset === 'images/close-16.png') {
        return self.options.closeImgUrl;
      } else {
        return asset;
      }
    } else {
      return chrome.extension.getURL(asset);
    }
  }
};
