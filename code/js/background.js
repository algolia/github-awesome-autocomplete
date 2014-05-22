;(function() {

  console.log('BACKGROUND SCRIPT WORKS!');

  var handlers = require('./modules/handlers').create('bg');
  // adding special background notification handlers onConnect / onDisconnect
  function logEvent(ev, context, tabId) {
    console.log(ev + ': context = ' + context + ', tabId = ' + tabId);
  }
  handlers.onConnect = logEvent.bind(null, 'onConnect');
  handlers.onDisconnect = logEvent.bind(null, 'onDisconnect');
  var msg = require('./modules/msg').init('bg', handlers);

  // issue `echo` command in 10 seconds after invoked,
  // schedule next run in 5 minutes
  function helloWorld() {
    console.log('===== will broadcast "hello world!" in 10 seconds');
    setTimeout(function() {
      console.log('>>>>> broadcasting "hello world!" now');
      msg.bcast('echo', 'hello world!', function() {
        console.log('<<<<< broadcasting done');
      });
    }, 10 * 1000);
    setTimeout(helloWorld, 5 * 60 * 1000);
  }

  // start broadcasting loop
  helloWorld();

})();
