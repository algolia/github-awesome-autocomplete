/* global document, safari */
var button = document.getElementById('refresh-button');
button.addEventListener('click', function() {
  safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('connect-with-github');
  safari.self.hide();
  return false;
});

var gotoLink = function(link) {
  var newTab = safari.application.activeBrowserWindow.openTab();
  newTab.url = link.getAttribute('href');
  safari.self.hide();
};

var links = ['github-repository', 'github-issues', 'algolia-link'];
for (var i = 0; i < links.length; ++i) {
  var link = document.getElementById(links[i]);
  link.addEventListener('click', gotoLink.bind(null, link));
}
