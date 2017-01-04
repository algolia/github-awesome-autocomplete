var buttons = require('sdk/ui/button/toggle');
var pageMods = require("sdk/page-mod");
var data = require("sdk/self").data;
var simpleStorage = require('sdk/simple-storage');
var panels = require("sdk/panel");

var panel, button = buttons.ToggleButton({
  id: "github-awesome-autocomplete",
  label: "GitHub Awesome Autocomplete",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: function(state) {
    if (state.checked) {
      panel.show({
        position: button
      });
    }
  }
});

panel = panels.Panel({
  width: 400,
  height: 590,
  contentURL: data.url("firefox.html"),
  contentStyleFile: data.url("content.css"),
  contentScript: "document.getElementById('refresh-button').addEventListener('click', function() {" +
    "  self.port.emit('connect-with-github', {});" +
    "  return false;" +
    "});" +
    "document.getElementById('reset-login').addEventListener('click', function() {" +
    "  self.port.emit('reset-login', {});" +
    "  return false;" +
    "});",
  onHide: function() {
    button.state('window', {checked: false});
  }
});

pageMods.PageMod({
  include: "*.github.com",
  contentStyleFile: data.url("content.css"),
  contentScriptFile: [
    data.url("libs/jquery-1.9.1.min.js"),
    data.url("libs/hogan-3.0.1.js"),
    data.url("libs/typeahead.bundle.js"),
    data.url("libs/algoliasearch.js"),
    data.url("templates/issue.js"),
    data.url("templates/repo.js"),
    data.url("templates/user.js"),
    data.url("templates/your-repo.js"),
    data.url("content.js"),
    data.url("helpers.js"),
    data.url("storage.js")
  ],
  contentScriptOptions: {
    logoUrl: data.url("algolia128x40.png"),
    closeImgUrl: data.url("close-32.png")
  },
  onAttach: function(worker) {
    worker.port.on('read-storage', function() {
      worker.port.emit('storage', simpleStorage.storage);
    });
    worker.port.on('update-storage', function(data) {
      simpleStorage.storage[data[0]] = data[1];
    });
  }
});
