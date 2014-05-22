//
// chrome.devtools.inspectedWindow.tabId
//

// return the same id the same time
var data = { inspectedWindow: { tabId: 1 } };
data.__setTabId = function(id) { data.inspectedWindow.tabId = id; };

// exported
module.exports.devtools = data;
