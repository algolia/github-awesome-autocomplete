var buttons = require('sdk/ui/button/toggle');
var pageMods = require("sdk/page-mod");
var data = require("sdk/self").data;
var simpleStorage = require('sdk/simple-storage');
var panels = require("sdk/panel");
var windows = require("sdk/windows").browserWindows;

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
  contentURL: data.url("panel.html"),
  contentStyleFile: data.url("content.css"),
  contentScript: "var button = document.getElementById('refresh-button');" +
    "button.addEventListener('click', function() {" +
    "  self.port.emit('connect-with-github', {});" +
    "  return false;" +
    "});",
  onHide: function() {
    button.state('window', {checked: false});
  }
});

var page = pageMods.PageMod({
  include: "*.github.com",
  contentStyleFile: data.url("content.css"),
  contentScriptFile: [
    data.url("libs/jquery-1.9.1.min.js"),
    data.url("libs/hogan-3.0.1.js"),
    data.url("libs/typeahead.bundle.min.js"),
    data.url("libs/algoliasearch.min.js"),
    data.url("content.js")
  ],
  contentScriptOptions: {
    logoUrl: data.url("algolia128x40.png"),
    closeImgUrl: data.url("close-16.png")
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

panel.port.on('connect-with-github', function() {
  windows.open({ url: "https://github.algolia.com/signin", onClose: function() { page.port.emit('reload-private', {}); } });
});
