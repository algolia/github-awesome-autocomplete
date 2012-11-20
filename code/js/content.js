requirejs.config(requirejsConfig);

requirejs(['jquery', 'config', 'util/messaging', 'util/messagingClient'],
function(   $,        config,   messaging,        client) {

  // uncomment the following line if content should be handling some requests
  // sent from background (when appropriate handler is implemented in
  // contentHandlers.js

  // messaging.contentInitialize();

  client.sendBroadcast({
    cmd: 'GetHtml',
    args: {
      template: 'content',
      data: {
        imageUrl: chrome.extension.getURL('/images/icon.png')
      }
    }
  }, function(response) {
    $(function() {
      $(response)
        .hide()
        .appendTo('body')
        .fadeIn('slow')
        .delay(config.showTime)
        .fadeOut('slow', function() {
          $(this).remove();
        });
    });
  });

});
