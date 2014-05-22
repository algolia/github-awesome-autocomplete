var assert = require('assert');
var h, handlers = require('./handlers');

// surpress console.log
handlers.__resetLog();

describe('handlers module', function() {

  it('should export create() function', function() {
    assert.strictEqual(handlers && typeof(handlers.create), 'function');
  });

  it('should create() handler object with 3 commands', function() {
    h = handlers.create('test');
    assert('object' === typeof(h));
    assert(3 === Object.keys(h).length);
    assert.deepEqual(['echo','random','randomAsync'], Object.keys(h).sort());
  });

  it('should "return" random number 0 - 999', function() {
    h.random(function(i) {
      assert('number' === typeof(i));
      assert(0 <= i);
      assert(i <= 999);
    });
  });

  // randomAsync and echo commands not tested ... nothing interesting there

});
