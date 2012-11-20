define(['type_a/myModule'], function(myBaseModule) {
  return {
    myOwnColor: 'red',
    myBaseColor: myBaseModule.myColor
  };
});
