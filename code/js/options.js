;(function() {
  console.log('OPTIONS SCRIPT WORKS!');

  var handlers = require('./modules/handlers').create('options');
  var msg = require('./modules/msg').init('options', handlers);
  var form = require('./modules/form');
  var runner = require('./modules/runner');

  form.init(runner.go.bind(runner, msg));
})();
