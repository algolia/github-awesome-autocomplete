// initialize RequireJS
var requirejs = require('requirejs');
var rc = require('../modules/requireConfig');
requirejs.config(rc.init());

// run unit test with dependencies
var myModule = requirejs('type_b/myModule');

describe("Sample unit test", function() {
  it ("myModule.myColor should equal 'red' and myBaseColor should equal 'blue'", function() {
    expect(myModule.myOwnColor).toEqual('red');
    expect(myModule.myBaseColor).toEqual('blue');
  });
});
