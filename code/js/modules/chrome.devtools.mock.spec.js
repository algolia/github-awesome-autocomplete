var assert = require('assert');
var devtools = require('./chrome.devtools.mock').devtools;

describe('chrome.devtools.mock module', function() {

  it('should export static data structure', function() {
    var id = 10;
    assert('object' === typeof(devtools));
    devtools.__setTabId(id);
    assert('object' === typeof(devtools.inspectedWindow));
    assert(id === devtools.inspectedWindow.tabId);
  });

});
