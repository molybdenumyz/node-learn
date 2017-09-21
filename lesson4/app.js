var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var express = require('express');




// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
    .end(function (err, sres) {
        if (err) {
            return console.error(err);
        }
        var topicUrls = [];
        var $ = cheerio.load(sres.text);
        // 获取首页所有的链接
        $('#topic_list .topic_title').each(function (idx, element) {
            var $element = $(element);
            // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
            // 我们用 url.resolve 来自动推断出完整 url，变成
            // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
            // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
            var href = url.resolve(cnodeUrl, $element.attr('href'));
            topicUrls.push(href);
        });

        topicUrls = topicUrls.slice(0, 3)

        var ep = new eventproxy();

        ep.after('topic_html', topicUrls.length, function (topics) {

            topics = topics.map(function (topic) {

                var topicUrl = topic[0];
                var topicHtml = topic[1];
                var $ = cheerio.load(topicHtml);

                var userHref = url.resolve(cnodeUrl, $('.user_info').children().attr('href'));

                return ({
                    title: $('.topic_full_title').text().trim(),
                    href: topicUrl,
                    comment1: $('.reply_content').eq(0).text().trim(),
                    userInfo: userHref
                });
            });


            var ep2 = new eventproxy();
            ep.after('user_html', topics.length, function (users) {
                users = users.map(function (user, index) {
                    var $ = cheerio.load(user);
                    
                    return ({
                        title: topics[index].title,
                        href: topics[index].href,
                        comment1: topics[index].comment1,
                        author1: $('.user_name').children('a').text(),
                        score1: $('.floor').children('.big').text()
                    })
                })
                console.log(users);
            })

            topics.forEach(topic => {
                superagent.get(topic.userInfo).end(function (err, res) {
                    console.log('fetch' + topic.userInfo + '  successful');
                    ep.emit('user_html', res.text)
                })
            })
        })


        topicUrls.forEach(topicUrl => {
            superagent.get(topicUrl).end(function (err, res) {
                console.log('fetch ' + topicUrl + ' successful');
                //执行之后提醒监听函数
                ep.emit('topic_html', [topicUrl, res.text]);
            });
        }, this);


    });






