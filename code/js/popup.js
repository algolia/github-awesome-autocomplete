/* global document, chrome */

document.getElementById('refresh-button').addEventListener('click', function() {
  chrome.tabs.getSelected(null, function(tab) {
    if (tab && tab.url.indexOf('https://github.com') === 0) {
      chrome.tabs.executeScript({ code: 'window.refreshRepositories()' });
    }
  });
});
