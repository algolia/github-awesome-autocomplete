/* global document, chrome, self */

var button = document.getElementById('refresh-button');
button.addEventListener('click', function() {
  chrome.tabs.executeScript({ code: 'window.refreshRepositories()' });
  chrome.tabs.executeScript({ code: 'window.clearPrivateKey()' });
  chrome.tabs.executeScript({ code: 'window.connectWithGitHub()' });
  return false;
});

var links = ['github-repository', 'github-issues', 'algolia-link'];
var gotoLink = function(link) {
  chrome.tabs.executeScript({ code: 'location.href="' + link.getAttribute('href') +'"' });
  self.close();
};
for (var i = 0; i < links.length; ++i) {
  var link = document.getElementById(links[i]);
  link.addEventListener('click', gotoLink.bind(null, link));
}
