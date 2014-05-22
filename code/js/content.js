;(function() {
  console.log('CONTENT SCRIPT WORKS!');

  var $ = require('./libs/jquery');
  var handlers = require('./modules/handlers').create('ct');
  require('./modules/msg').init('ct', handlers);

  console.log('jQuery version:', $().jquery);
})();
