;(function() {
  var handlers = require('./modules/handlers').create('dt');
  require('./modules/msg').init('dt', handlers);
})();
