var express = require('express');
//同级导入包，./package/file
var fibonacci = require('./service/service')

  var app = express();
  
  app.get('/fib', function (req, res) {
    // http 传来的东西默认都是没有类型的，都是 String，所以我们要手动转换类型
    var n = Number(req.query.n);
    try {
      // 为何使用 String 做类型转换，是因为如果你直接给个数字给 res.send 的话，
      // 它会当成是你给了它一个 http 状态码，所以我们明确给 String

      data = {
          "code":0,
          "result":fibonacci.fibonacci(n)
      }
      res.send(data);
    } catch (e) {
      // 如果 fibonacci 抛错的话，错误信息会记录在 err 对象的 .message 属性中。
      // 拓展阅读：https://www.joyent.com/developers/node/design/errors

      data = {
          "code":10000,
          "message":e.message
      }
      res
        .status(202)
        .send(data);
    }
  });
  
  // 暴露 app 出去。module.exports 与 exports 的区别请看《深入浅出 Node.js》
//module.exports = app;
  
  app.listen(3000, function () {
    console.log('app is listening at port 3000');
  });