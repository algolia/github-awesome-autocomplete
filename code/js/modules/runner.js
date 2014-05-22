// module that translates structured information about command invocation from
// form.js into real command invocation
//
// exported function `go` takes two parameters: messaging object `msg` on which
// it'll invoke the methods, and structured `info` which is collected from the
// form. we assume both `msg` and `info` parameters to be valid


function log() { console.log.apply(console, arguments); }
function callback(res) { log('<<<<< callback invoked, return value = ' + JSON.stringify(res)); }

var SAME_TAB = require('./msg').SAME_TAB;

module.exports.go = function(msg, info) {
  if ('bg' === info.type) { // msg.bg
    if ('echo' === info.cmd) {
      log(">>>>> invoking msg.bg('echo', '" + info.arg + "', callback)");
      msg.bg('echo', info.arg, callback);
    } else if ('random' === info.cmd) {
      log(">>>>> invoking msg.bg('random', callback)");
      msg.bg('random', callback);
    } else {
      log(">>>>> invoking msg.bg('randomAsync', callback) ... 15 sec delay");
      msg.bg('randomAsync', callback);
    }
  } else {  // msg.bcast + msg.cmd
    if ('echo' === info.cmd) {
      if (-1 === info.tab) { // all tab ids
        if (info.ctx_all) {
          log(">>>>> invoking msg." + info.type + "('echo', '" + info.arg + "', callback)");
          msg[info.type]('echo', info.arg, callback);
        } else {
          log(">>>>> invoking msg." + info.type + "(" + JSON.stringify(info.ctxs) +
              ", 'echo', '" + info.arg + "', callback)");
          msg[info.type](info.ctxs, 'echo', info.arg, callback);
        }
      } else if (-2 === info.tab) { // same id
        if (info.ctx_all) {
          log(">>>>> invoking msg." + info.type + "(SAME_TAB, 'echo', '" +
              info.arg + "', callback)");
          msg[info.type](SAME_TAB, 'echo', info.arg, callback);
        } else {
          log(">>>>> invoking msg." + info.type + "(SAME_TAB, " + JSON.stringify(info.ctxs) +
              ", 'echo', '" + info.arg + "', callback)");
          msg[info.type](SAME_TAB, info.ctxs, 'echo', info.arg, callback);
        }
      } else {  // tab id provided
        if (info.ctx_all) {
          log(">>>>> invoking msg." + info.type + "(" + info.tab + ", 'echo', '" +
              info.arg + "', callback)");
          msg[info.type](info.tab, 'echo', info.arg, callback);
        } else {
          log(">>>>> invoking msg." + info.type + "(" + info.tab + ", " +
              JSON.stringify(info.ctxs) + ", 'echo', '" + info.arg + "', callback)");
          msg[info.type](info.tab, info.ctxs, 'echo', info.arg, callback);
        }
      }
    } else {  // random + randomAsync
      if (-1 === info.tab) { // all tab ids
        if (info.ctx_all) {
          log(">>>>> invoking msg." + info.type + "('" + info.cmd + "', callback)");
          msg[info.type](info.cmd, callback);
        } else {
          log(">>>>> invoking msg." + info.type + "(" + JSON.stringify(info.ctxs) +
              ", '" + info.cmd + "', callback)");
          msg[info.type](info.ctxs, info.cmd, callback);
        }
      } else if (-2 === info.tab) { // same id
        if (info.ctx_all) {
          log(">>>>> invoking msg." + info.type + "(SAME_TAB, '" + info.cmd + "', callback)");
          msg[info.type](SAME_TAB, info.cmd, callback);
        } else {
          log(">>>>> invoking msg." + info.type + "(SAME_TAB, " + JSON.stringify(info.ctxs) +
              ", '" + info.cmd + "', callback)");
          msg[info.type](SAME_TAB, info.ctxs, info.cmd, callback);
        }
      } else {  // tab id provided
        if (info.ctx_all) {
          log(">>>>> invoking msg." + info.type + "(" + info.tab + ", '" +
              info.cmd + "', callback)");
          msg[info.type](info.tab, info.cmd, callback);
        } else {
          log(">>>>> invoking msg." + info.type + "(" + info.tab + ", " +
              JSON.stringify(info.ctxs) + ", '" + info.cmd + "', callback)");
          msg[info.type](info.tab, info.ctxs, info.cmd, callback);
        }
      }
    }
  }
};

// for surpressing console.log output in unit tests:
module.exports.__resetLog = function() { log = function() {}; };
