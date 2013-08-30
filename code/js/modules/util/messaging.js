define(['underscore', 'backgroundHandlers', 'contentHandlers'],
function(_,            backgroundHandlers,   contentHandlers) {

  // Module for request-response message communication between background part
  // and content script (can be also used from action popup html carefully).
  //
  // In given context, initialize request dispatcher. Request is an object with
  // `cmd` string property indicating the command and `args` property (of any
  // type) that is passed to the handler of the request as first argument.
  //
  // Handler is a function named `handler` + `request.cmd`. It has to accept
  // three arguments: argument object provided by the sender (`request.args`),
  // `sender` describing the sender entity, and `sendResponse` that is a
  // function provided by the sender in order to provide response back.
  // `sendResponse` function accepts at least one argument: the response (of any
  // type). All the available handler functions must be stored in either of the
  // `handlers` storage objects in backgroundHandlers.js or contentHandlers.js.
  //

  // Invoking handler corresponding to `request.cmd`
  function dispatcher(handlers, request, sender, sendResponse) {
    if (!request || !request.cmd || !_.isString(request.cmd)) {
      throw 'Error: Bad request!';
    }

    var handlerName = 'handle' + request.cmd;
    var handler = handlers[handlerName];
    if (!_.isFunction(handler)) {
      // Target window doesn't know how to handle this request.
      return;
    }

    return handler(request.args, sender, sendResponse);
  };

  // Creating dispatcher wrapper
  function makeDispatcher(handlers) {
    function wrapper(request, sender, sendResponse) {
      return dispatcher(handlers, request, sender, sendResponse);
    };
    return wrapper;
  }

  return {

    backgroundInitialize: function() {
      chrome.extension.onMessage.addListener(
        makeDispatcher(backgroundHandlers)
      );
    },

    contentInitialize: function() {
      chrome.extension.onMessage.addListener(
        makeDispatcher(contentHandlers)
      );
    }

  };

});
