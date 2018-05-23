/**
 * 用户权限校验
 */

'use strict';

var Utils = require('../helper/utils');
var Config = require('../config');

var Promise = require('bluebird');

/**
 * 校验erp的用户名,密码
 * @param options
 */
function checkUserInfo(options) {
  // return Utils.remotePostForm({
  //   url: Config.checkUserUrl,
  //   data: options
  // })

  var doc = JSON.stringify({
    REQ_FLAG : true,
    REQ_DATA : {
      username : 'admin',
      password : 'admin',
      userId: '1',
      fullname : 'administrator',
      email : 'admin@admin.com'
    }
  });
  return new Promise(function(resolve, reject) {
    resolve(doc)
  })
}

module.exports = {
  /**
   * 登录检测
   * @param req
   * @param res
   * @param next
   */
  loginCheck: function(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      // res.redirect('/index/login');
      res.send({
        code: 1,
        msg: "未登录，请先登录"
      });
    }
  },
  /**
   * 登录提交
   * @param req
   * @param res
   * @param next
   */
  loginPost: function(req, res) {
    var username = req.body.username,
      password = req.body.password;
    /**
     * 校验erp信息
     */

    checkUserInfo({
      username: username,
      password: Utils.md5(password)
    }).then(function(doc) {
      var doc = JSON.parse(doc);
      if (doc.REQ_FLAG == true && doc.REQ_DATA.username == username && doc.REQ_DATA.password == password) {
        req.session.user = doc.REQ_DATA;
        console.info(req.session.user);
        res.send({
          code: 0,
          msg: "success"
        });
      } else {
        res.send({
          code: 1,
          msg: "用户名或密码不正确"
        });
      }
    });
  },
  /**
   * 退出
   * @param req
   * @param res
   * @param next
   */
  logout: function(req, res, next) {
    req.session.destroy(function(err) {
      if (err) {
        next(err)
      } else {
        res.redirect('/index/login');
      }
    })
  },
  loginInfo: function(req, res, next) {
    res.json({
      code: 0,
      data: req.session.user
    });
  }
}
