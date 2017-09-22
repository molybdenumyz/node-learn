var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');
var express = require('express');

var app = express();

var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';
// 什么时候用 eventproxy，什么时候使用 async 呢？它们不都是用来做异步流程控制的吗？
// 当你需要去多个源(一般是小于 10 个)汇总数据的时候，用 eventproxy 方便；当你需要用到队列，需要控制并发数，或者你喜欢函数式编程思维时，使用 async

app.get('/', function (err, resq) {
    superagent.get(cnodeUrl)
        .end(function (err, res) {
            if (err) {
                return console.error(err);
            }
            var topicUrls = [];
            var $ = cheerio.load(res.text);
            $('#topic_list .topic_title').each(function (idx, element) {
                var $element = $(element);
                var href = url.resolve(cnodeUrl, $element.attr('href'));
                topicUrls.push(href);
            });

            //此处的callback是mapLimit的最后接受回调的函数，在其中异步的函数的回调会被组装成数组，在result里接受
            //异步调用中，每一个方法都是异步的，只是判断是不是有东西
            async.mapLimit(topicUrls, 10, function (topicUrl, callback) {

                console.log(Date.now())
                superagent.get(topicUrl)
                    .end(function (err, res) {
                        console.log('fetch ' + topicUrl + ' successful');
                        topic = function () {
                            var $ = cheerio.load(res.text);

                            return ({
                                title: $('.topic_full_title').text().trim(),
                                href: topicUrl,
                                comment1: $('.reply_content').eq(0).text().trim(),
                            });
                        }
                        //此处函数如果不使用的话，就会返回函数体
                        aa = topic();
                        callback(err, aa);
                    })

            }, function (err, result) {
                console.log(Date.now())
                resq.send(result)
            })
        });
});

app.listen(3000, function (req, res) {
    console.log('app is running at port 3000');
});
