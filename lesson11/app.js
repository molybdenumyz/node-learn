// var adder = function (x) {
//     var base = x;
//     return function (n) {
//       console.log('n: ',n)
//       console.log('base: ',base)
//       return n + base;
//     };
//   };
  
//   var add10 = adder(10);
//   console.log(add10(5));
  
//   var add20 = adder(20);
//   console.log(add20(5));


  for (var i=1; i<=5;i++){
      (function(idx) {
          setTimeout(function(){
              console.log(idx)
          },5);
      })(i);
  }