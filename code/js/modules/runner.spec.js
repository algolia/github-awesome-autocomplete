var assert = require('assert');
var sinon = require('sinon');
var runner = require('./runner');

// surpress console.log
runner.__resetLog();

var msg;
var SAME_TAB = require('./msg').SAME_TAB;

describe('runner module', function() {

  beforeEach(function() {
    msg = {
      bcast: sinon.spy(),
      cmd: sinon.spy(),
      bg: sinon.spy()
    };
  });

  it('should export go() function', function() {
    assert.strictEqual(runner && typeof(runner.go), 'function');
  });

  it('should invoke msg.bg() function', function() {
    runner.go(msg, { type: 'bg', cmd: 'echo' });
    assert(!msg.bcast.calledOnce);
    assert(!msg.cmd.calledOnce);
    assert(msg.bg.calledOnce);
  });

  it('should invoke msg.cmd() function', function() {
    runner.go(msg, { type: 'cmd', cmd: 'echo' });
    assert(!msg.bcast.calledOnce);
    assert(msg.cmd.calledOnce);
    assert(!msg.bg.calledOnce);
  });

  it('should invoke msg.bcast() function', function() {
    runner.go(msg, { type: 'bcast', cmd: 'echo' });
    assert(msg.bcast.calledOnce);
    assert(!msg.cmd.calledOnce);
    assert(!msg.bg.calledOnce);
  });

  it('should issue "echo" command with provided argument', function() {
    runner.go(msg, { type: 'bcast', cmd: 'echo', arg: 'hello', tab: -1, ctx_all: true});
    assert(msg.bcast.calledWith('echo', 'hello'));
  });

  it('should issue "random" command and ignore provided argument', function() {
    runner.go(msg, { type: 'bcast', cmd: 'random', arg: 'hello', tab: -1, ctx_all: true});
    assert(!msg.bcast.calledWith('random', 'hello'));
  });

  it('should issue "echo" command with tabId = SAME_TAB', function() {
    runner.go(msg, { type: 'bcast', cmd: 'echo', arg: 'hello', tab: -2, ctx_all: true});
    assert(msg.bcast.calledWith(SAME_TAB, 'echo', 'hello'));
  });

  it('should issue "echo" command with provided tabId', function() {
    runner.go(msg, { type: 'bcast', cmd: 'echo', arg: 'hello', tab: 42, ctx_all: true});
    assert(msg.bcast.calledWith(42, 'echo', 'hello'));
  });

  it('should issue "echo" command with provided contexts', function() {
    runner.go(msg, { type: 'bcast', cmd: 'echo', arg: 'hello', tab: -1, ctx_all: false, ctxs: ['ctx1','ctx2','ctx3']});
    assert(msg.bcast.calledWith(['ctx1','ctx2','ctx3'], 'echo', 'hello'));
  });

  it('should issue "echo" command with provided tabId and contexts', function() {
    runner.go(msg, { type: 'bcast', cmd: 'echo', arg: 'hello', tab: 42, ctx_all: false, ctxs: ['ctx1','ctx2','ctx3']});
    assert(msg.bcast.calledWith(42, ['ctx1','ctx2','ctx3'], 'echo', 'hello'));
  });
});
