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


var repo = document.getElementById('github-repository');
repo.addEventListener('click', function() {
  chrome.tabs.executeScript({ code: 'location.href="' + repo.getAttribute('href') +'"' });
  self.close();
});

var issues = document.getElementById('github-issues');
issues.addEventListener('click', function() {
  chrome.tabs.executeScript({ code: 'location.href="' + issues.getAttribute('href') +'"' });
  self.close();
});
