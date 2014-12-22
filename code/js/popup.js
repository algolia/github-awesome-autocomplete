/* global document, chrome, self */

var button = document.getElementById('refresh-button');
button.addEventListener('click', function() {
  chrome.tabs.executeScript({ code: 'window.refreshRepositories()' });

  button.classList.add('loading');
  setTimeout(function() {
    button.classList.remove('loading');
    self.close();
  }, 1000);
});
