define({

  // Convenient module for using the messaging system (see messaging.js).

  sendBroadcast: function(request, callback) {
    callback = callback || function() {};
    chrome.extension.sendRequest(request, callback);
  },

  sendToContentScript: function(tabId, request, callback) {
    callback = callback || function() {};
    chrome.tabs.sendRequest(tabId, request, callback);
  }

});
