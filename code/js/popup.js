;(function() {
  console.log('POPUP SCRIPT WORKS!');

  var handlers = require('./modules/handlers').create('popup');
  var msg = require('./modules/msg').init('popup', handlers);
  var form = require('./modules/form');
  var runner = require('./modules/runner');

  form.init(runner.go.bind(runner, msg));
})();
