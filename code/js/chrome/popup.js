/* global document, chrome, self, screen */

var button = document.getElementById('refresh-button');
button.addEventListener('click', function() {
  chrome.tabs.executeScript({ code: 'window.refreshRepositories()' });
  chrome.tabs.executeScript({ code: 'window.clearPrivateKey()' });

  var width = 1050;
  var height = 700;
  var left = (screen.width - width) / 2 - 16;
  var top = (screen.height - height) / 2 - 50;
  var windowFeatures = 'menubar=no,toolbar=no,status=no,width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;
  chrome.tabs.executeScript({ code: 'window.open("https://github.algolia.com/signin", "authPopup", "' + windowFeatures + '");' });
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
