/**
 * 自动加载路由配置
 */

var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');
var auth = require('./controllers/auth');

module.exports = function(app, options){
  
  /**
   * 处理没有经过react-router拦截的请求
   */
  app.use('/interface', function(req,res,next){
    if (req.session.user){
      res.render('index');
    }else{
      res.redirect('/index/login');
    }
  });

  /**
   * 自动导入路由
   */
  var verbose = options.verbose;
  fs.readdirSync(__dirname+'/routes').forEach(function(name){
    var name = name.replace(/.js/,'');
    var obj = require('./routes/' + name);
    app.use('/'+name, obj);
  });

  /**
   * 匹配首页路由
   */
  app.use('/', function(req,res,next){
    if(req.url == '/'){
      res.redirect('/index');
    }else{
      next()
    }
  });

  /**
   * 恢复 mock 数据页路由
   */
  app.use('/restore', function(req, res, next){
    if (req.session.user){
      res.render('index');
    }else{
      res.redirect('/index/login');
    }
  });
};