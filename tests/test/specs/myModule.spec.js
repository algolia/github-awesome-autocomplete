// initialize RequireJS
var requirejs = require('requirejs');
var rc = require('../modules/requireConfig');
requirejs.config(rc.init());

// run unit test with dependencies
requirejs(['type_a/myModule'],
  function(myModule) {
    describe("Sample unit test", function() {
      it ("myModule.myColor should equal 'red' and myBaseColor should equal 'blue'", function() {
        expect(myModule.myColor).toEqual('red');
        expect(myModule.myBaseColor).toEqual('blue');
      });
    });
  }
);
