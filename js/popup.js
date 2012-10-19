requirejs.config(requirejsConfig);

requirejs(['jquery', 'underscore', 'underscore.string', 'lib/backbone', 'type_a/myModule'],
function($, _, _s, backbone, myModule) {
  $('<div style="width:250px"></div>')
    .appendTo('body')
    .html(
      'My favourite color is: ' + _s.titleize(myModule.myColor) + '<br />' +
      'My second favourite color is: ' + _s.titleize(myModule.myBaseColor)
    );
});