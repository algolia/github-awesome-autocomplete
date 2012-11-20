define(function() {
  var counter = 0;

  return {
    getNext: function() {
      return ++counter;
    }
  };
});
