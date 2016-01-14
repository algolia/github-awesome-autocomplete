/* global self, chrome, safari */

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
    } else if (typeof chrome !== 'undefined') {
      return chrome.extension.getURL(asset);
    } else if (typeof safari !== 'undefined') {
      return safari.extension.baseURI + asset;
    } else {
      return asset;
    }
  }
};
