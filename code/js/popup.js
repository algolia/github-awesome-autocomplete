requirejs.config(requirejsConfig);

requirejs(['jquery', 'util/messagingClient', 'config'],
function($, client, config) {
  var popupData = {
    greeting: config.greeting
  };
  client.sendBroadcast({ cmd: 'GetPopupStats' }, function(stats) {
    switch (stats.counter) {
      case 1:
        popupData.counter = 'once';
        break;
      case 2:
        popupData.counter = 'twice';
        break;
      default:
        popupData.counter = '' + stats.counter + ' times';
        break;
    }
    client.sendBroadcast({
      cmd: 'GetHtml',
      args: {
        template: 'popup',
        data: popupData
      }
    }, function(result) {
      if (result) {
        $(function() {
          $(result).appendTo('body');
        });
      }
    });
  });
});
