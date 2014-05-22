// create handler module for given `context`.
// handles `random`, `randomAsync`, and `echo` commands.
// both `random` function log the invocation information to console and return
// random number 0 - 999. `randomAsync` returns the value with 15 second delay.
// `echo` function doesn't return anything, just logs the input parameter
// `what`.

function log() {
  console.log.apply(console, arguments);
}

module.exports.create = function(context) {
  return {
    random: function(done) {
      log('---> ' + context + '::random() invoked');
      var r = Math.floor(1000 * Math.random());
      log('<--- returns: ' + r);
      done(r);
    },
    randomAsync: function(done) {
      log('---> ' + context + '::randomAsync() invoked (15 sec delay)');
      setTimeout(function() {
        var r = Math.floor(1000 * Math.random());
        log('<--- returns: ' + r);
        done(r);
      }, 15 * 1000);
    },
    echo: function(what, done) {
      log('---> ' + context + '::echo("' + what + '") invoked');
      log('<--- (no return value)');
      done();
    }
  };
};

// for surpressing console.log output in unit tests:
module.exports.__resetLog = function() { log = function() {}; };
