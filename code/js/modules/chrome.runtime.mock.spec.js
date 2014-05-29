var assert = require('assert');
var runtime = require('./chrome.runtime.mock').runtime;

var log = [];
// function dumpLog() { console.log(JSON.stringify(log, null, 4)); }
function addLogEntry() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
  log.push(args);
}
function createCb(scope) {
  return function() {
    Array.prototype.unshift.call(arguments, scope);
    addLogEntry.apply(null, arguments);
  };
}

var onConnect = createCb('main::onConnect');

function verifyPort(port) {
  assert('object' === typeof(port));
  assert('myPort' === port.name);
  assert('function' === typeof(port.disconnect));
  assert('function' === typeof(port.postMessage));
  assert('object' === typeof(port.onDisconnect));
  assert('function' === typeof(port.onDisconnect.addListener));
  assert('function' === typeof(port.onDisconnect.removeListener));
  assert('object' === typeof(port.onMessage));
  assert('function' === typeof(port.onMessage.addListener));
  assert('function' === typeof(port.onMessage.removeListener));
}

describe('chrome.runtime.mock module', function() {

  beforeEach(function() { log = []; runtime.onConnect.addListener(onConnect); });
  afterEach(function() { runtime.onConnect.removeListener(onConnect); });

  it('should export connect method and onConnect event', function() {
    assert('object' === typeof(runtime));
    assert('function' === typeof(runtime.connect));
    assert('object' === typeof(runtime.onConnect));
    assert('function' === typeof(runtime.onConnect.addListener));
    assert('function' === typeof(runtime.onConnect.removeListener));
  });

  it('connect() should create Port', function(done) {
    var port = runtime.connect({ name: 'myPort' });
    verifyPort(port);
    assert('undefined' === typeof(port.sender));
    setImmediate(done);  // connect writes to log asynchronously, so need to wait here
  });

  it('should notify onConnect handler when Port is connected', function(done) {
    runtime.connect({ name: 'myPort' });
    setImmediate(function() {
      assert(1 === log.length);
      assert('main::onConnect' === log[0][0]);
      var port = log[0][1];
      verifyPort(port);
      assert('number' === typeof(port.sender && port.sender.tab && port.sender.tab.id));
      done();
    });
  });

  it('should be able to add/remove onConnect listners', function(done) {
    runtime.connect();
    setImmediate(function() {
      assert(1 === log.length);  // orig
      var cb = createCb('extra::onConnect');
      runtime.onConnect.addListener(cb);
      runtime.connect();
      setImmediate(function() {
        assert(3 === log.length);  // orig + (orig + extra)
        assert(log[1][1] === log[2][1]);  // the listners should get the same Port
        runtime.onConnect.removeListener(cb);
        runtime.connect();
        setImmediate(function() {
          assert(4 === log.length); // orig + (orig + extra) + orig
          assert('main::onConnect' === log[3][0]);
          done();
        });
      });
    });
  });

  it('should pass messages between Port parts', function(done) {
    var portA = runtime.connect();
    setImmediate(function() {
      var portB = log[0][1]; // counterpart to portA
      var onMsgA = createCb('A::onMsg');
      var onMsgB = createCb('B::onMsg');
      portA.onMessage.addListener(onMsgA);
      portB.onMessage.addListener(onMsgB);
      portA.postMessage();
      setImmediate(function() {
        assert(2 === log.length);
        assert('B::onMsg' === log[1][0]);
        portB.postMessage({ b: false, i: 1, s: 'str', a: ['a','b'], o : {x:1,y:2} });
        setImmediate(function() {
          assert(3 === log.length);
          var _ref = log[2];
          assert(_ref[0] === 'A::onMsg');
          assert.deepEqual(_ref[1], { b: false, i: 1, s: 'str', a: ['a','b'], o : {x:1,y:2} });
          done();
        });
      });
    });
  });

  it('should be abble to add/remove more onMessage Port handlers', function(done) {
    var portA = runtime.connect();
    setImmediate(function() {
      var portB = log[0][1];
      portB.postMessage();
      setImmediate(function() {
        assert(1 === log.length);  // i.e. no message, no handler added yet
        var cb1 = createCb('A1::onMsg');
        var cb2 = createCb('A2::onMsg');
        portA.onMessage.addListener(cb1);
        portB.postMessage();
        setImmediate(function() {
          assert(2 === log.length);  // 1 new entry
          assert('A1::onMsg' === log[1][0]);
          portA.onMessage.addListener(cb2);
          portB.postMessage();
          setImmediate(function() {
            assert(4 === log.length);  // 2 new entries
            assert(log[2][0] !== log[3][0]);  // coming from different handlers
            portA.onMessage.removeListener(cb1);
            portB.postMessage();
            setImmediate(function() {
              assert(5 === log.length);
              assert('A2::onMsg' === log[4][0]);
              portA.onMessage.removeListener(cb1);  // removing for second time, should do no harm
              portB.postMessage();
              setImmediate(function() {
                assert(6 === log.length);
                assert('A2::onMsg' === log[5][0]);
                portA.onMessage.removeListener(cb2);
                portB.postMessage();
                setImmediate(function() {
                  assert(6 === log.length);  // no change
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  it('should not mix msg communication across different Ports', function(done) {
    var port1A = runtime.connect();
    var port2A = runtime.connect();
    port1A.onMessage.addListener(createCb('1A::onMsg'));
    port2A.onMessage.addListener(createCb('2A::onMsg'));
    setImmediate(function() {
      var port1B = log[0][1];
      var port2B = log[1][1];
      port1B.onMessage.addListener(createCb('1B::onMsg'));
      port2B.onMessage.addListener(createCb('2B::onMsg'));
      port1A.postMessage();
      setImmediate(function() {
        assert('1B::onMsg' === log[2][0]);
        port1B.postMessage();
        setImmediate(function() {
          assert('1A::onMsg' === log[3][0]);
          port2A.postMessage();
          setImmediate(function() {
            assert('2B::onMsg' === log[4][0]);
            port2B.postMessage();
            setImmediate(function() {
              assert('2A::onMsg' === log[5][0]);
              done();
            });
          });
        });
      });
    });
  });

  it('should notify onDisconnect handler when Port is closed', function(done) {
    var portA = runtime.connect();
    setImmediate(function() {
      var portB = log[0][1];
      portA.onDisconnect.addListener(createCb('A::onDisconnect'));
      portB.onDisconnect.addListener(createCb('B::onDisconnect'));
      portA.disconnect();
      setImmediate(function() {
        assert(2 === log.length);
        assert('B::onDisconnect' === log[1][0]);
        portB.disconnect();
        setImmediate(function() {
          assert(3 === log.length);
          assert('A::onDisconnect' === log[2][0]);
          var extraCb = createCb('A2::onDisconnect');
          portA.onDisconnect.addListener(extraCb);
          portA.disconnect();
          setImmediate(function() {
            assert(4 === log.length);
            assert('B::onDisconnect' === log[3][0]);
            portB.disconnect();
            setImmediate(function() {
              assert(6 === log.length);
              assert( (('A::onDisconnect' === log[4][0]) && ('A2::onDisconnect' === log[5][0])) ||
                      (('A::onDisconnect' === log[5][0]) && ('A2::onDisconnect' === log[4][0])) );
              portA.onDisconnect.removeListener(extraCb);
              portB.disconnect();
              setImmediate(function() {
                assert(7 === log.length);
                assert('A::onDisconnect' === log[6][0]);
                done();
              });
            });
          });
        });
      });
    });
  });

});
