;(function() {

  console.log('BACKGROUND SCRIPT WORKS!');

  // here we use SHARED message handlers, so all the contexts support the same
  // commands. in background, we extend the handlers with two special
  // notification hooks. but this is NOT typical messaging system usage, since
  // you usually want each context to handle different commands. for this you
  // don't need handlers factory as used below. simply create individual
  // `handlers` object for each context and pass it to msg.init() call. in case
  // you don't need the context to support any commands, but want the context to
  // cooperate with the rest of the extension via messaging system (you want to
  // know when new instance of given context is created / destroyed, or you want
  // to be able to issue command requests from this context), you may simply
  // omit the `hadnlers` parameter for good when invoking msg.init()
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
