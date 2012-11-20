define(['jquery', 'lib/mustache'], function($, mustache) {

  // template html cache
  var _cache = {};

  return {
    // template loading (synchronous)
    load: function(name) {
      var target = '/html/templates/' + name + '.html';
      if (!(target in _cache)) {
        $.ajax({
          url: chrome.extension.getURL(target),
          type: 'GET',
          async: false,
          cache: false,
          success: function(html) {
            _cache[target] = html;
          },
          error: function() {
            console.error('cannot load template "' + name + '"');
          }
        });
      }
      return _cache[target];
    },

    // template compilation
    compile: function(html, data) {
      return mustache.render(html, data);
    },

    // load + compile
    compileFromFile: function(name, data) {
      var html = this.load(name);
      if (html) {
        return this.compile(html, data);
      } else {
        return null;
      }
    }
  };

});
