/**
 * 路由入口
 */
var express = require('express');
var router = express.Router();

var auth = require('../controllers/auth');


// 登陆页路由
router.get('/login', function(req, res, next){
	if (req.session.user){
    	res.redirect('/index');
    }else{
		res.render('login');
    }
});

// 项目列表页路由
router.get('/', function(req, res, next){
	if (req.session.user){
		res.render('index');
    }else{
    	res.redirect('/index/login');
	}
}); 


module.exports = router;
