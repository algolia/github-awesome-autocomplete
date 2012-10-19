define(['type_b/myBaseModule'], function(myBaseModule) {
  return {
    myColor: 'red',
    myBaseColor: myBaseModule.myColor
  };
});
