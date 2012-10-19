requirejs.config(requirejsConfig);

requirejs(['jquery', 'underscore', 'underscore.string', 'lib/backbone', 'type_a/myModule'],
function($, _, _s, backbone, myModule) {
    console.log('My favourite color is: ' + _s.titleize(myModule.myColor));
    console.log('My second favourite color is: ' + _s.titleize(myModule.myBaseColor));
});