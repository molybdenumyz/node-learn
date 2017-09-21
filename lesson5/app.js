var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');
var express = require('express');

// 什么时候用 eventproxy，什么时候使用 async 呢？它们不都是用来做异步流程控制的吗？
// 当你需要去多个源(一般是小于 10 个)汇总数据的时候，用 eventproxy 方便；当你需要用到队列，需要控制并发数，或者你喜欢函数式编程思维时，使用 async

var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
    var delay = parseInt((Math.random() * 10000000) % 2000, 10);
    concurrencyCount++;
    console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
    setTimeout(function () {
        concurrencyCount--;
        callback(null, url + ' html content');
    }, delay);
};

var urls = [];
for (var i = 0; i < 30; i++) {
    urls.push('http://datasource_' + i);
}

//控制并发个数
async.mapLimit(urls, 5, function (url, callback) {
    fetchUrl(url, callback);
}, function (err, result) {
    console.log('final:');
    console.log(result);
});