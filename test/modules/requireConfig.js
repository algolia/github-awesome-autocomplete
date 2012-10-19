// RequireJS configuration module
// Takes configuration from project and modifies it for use with unit tests
;(function() {
  var fs = require('fs');

  exports.init = function() {

    // synchronously read script file containing requirejsConfig
    try {
      var data = fs.readFileSync('js/requireConfig.js', 'ascii');
    }
    catch(e) {
      console.error(e);
      return {};
    }

    // evaluate script to initialise requirejsConfig object
    eval(data.toString());

    // absolute path prefix for test suite
    var pathPrefix = __dirname + '/../..';

    // now we modify the config
    var rc = requirejsConfig;

    // modify the baseUrl to point to our modules
    rc.baseUrl = pathPrefix + rc.baseUrl;

    // modify any path urls
    var path;
    for (path in rc.paths) {
      if (typeof rc.paths[path] === 'string') {
        rc.paths[path] = pathPrefix + rc.paths[path];
      }
    }

    // add a path for test modules
    rc.paths.test = __dirname + '/../modules';

    // set paths to libraries
    rc.paths.underscore = pathPrefix + '/js/lib/underscore';
    rc.paths['underscore.string'] = pathPrefix + '/js/lib/underscore.string';

    // you may want to remap some paths to replace extension modules with mock versions for unit tests, eg.:
    //rc.paths['type_a/myModule'] = __dirname + '/type_a/myModule';

    return rc;
  };

}).call(this);
