define({

  // Convenient module for using the messaging system (see messaging.js).

  sendBroadcast: function(request, callback) {
    callback = callback || function() {};
    chrome.extension.sendMessage(request, callback);
  },

  sendToContentScript: function(tabId, request, callback) {
    callback = callback || function() {};
    chrome.tabs.sendMessage(tabId, request, callback);
  }

});
