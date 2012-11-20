define(['util/template', 'stats'], function(template, stats) {

  // Handler prototype:
  // function handle<REQUEST.CMD>(args, sender, sendResponse)
  //
  // See util/messaging.js for more details.
  //

  return {

    handleGetHtml: function(args, sender, sendResponse) {
      sendResponse(template.compileFromFile(args.template, args.data));
    },

    handleGetPopupStats: function(args, sender, sendResponse) {
      sendResponse({ counter: stats.getNext() });
    }

  };

});
