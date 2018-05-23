/**
 * 根据用户配置提供服务端接口支持d
 */

var HistoryModel = require('../models/history.js');
var express = require('express');
var router = express.Router();
// var dynamicApi = require('../helper/utils').dynamicApi;
var Mock = require('mockjs');

router.use('/:pid/*', function (req, res, next) {
  var pid = req.params.pid;
  var mockPath = '/' + req.params[0];
  console.log('it is coming!!!', req.baseUrl);
  console.log('pid is:', pid);
  console.log('mock path is:', mockPath);

  HistoryModel.find({pId: pid}, function (err, interfaceList) {
    if (err) {
      console.log('create mock proxy error!', err);
      next(err);
    }
    if (interfaceList && interfaceList.length > 0) {
      var bestChoice, matchLength = 0;
      //1.进行决对匹配
      interfaceList.forEach(function (interfaceDoc) {
        if (mockPath === interfaceDoc.uri || mockPath.slice(1) === interfaceDoc.uri) {
          bestChoice = interfaceDoc;
          console.log(mockPath + '匹配到了相等值.');
          return;
        }
      });
      //2.进行近似匹配
      !bestChoice && interfaceList.forEach(function (interfaceDoc) {
        //路径最大匹配原则
        if (mockPath.startsWith(interfaceDoc.uri) && interfaceDoc.uri.length > matchLength) {
          bestChoice = interfaceDoc;
          matchLength = interfaceDoc.uri.length;
          console.log(mockPath + '匹配到了近似值.' + interfaceDoc.uri);
        }
      });
      //3.都没有匹配上 就去404吧
      if (bestChoice) {
        var resMockData = Mock.mock(eval('(' + bestChoice.resMockRule + ')'));
        res.set({
          "Access-Control-Allow-Origin": req.headers.origin,
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Headers": "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With"
        });
        res.jsonp(resMockData);
      } else {
        next();
      }
      //FIXME:将interfaceDoc.uri转化为正则表达式进行匹配，解决路径中包含参数的问题
    }

  });
});

module.exports = router;
