;(function() {
  var handlers = require('./modules/handlers').create('ct');
  require('./modules/msg').init('ct', handlers);

  console.log('extension is loaded');
})();
