var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({storage: multer.memoryStorage()});

var _auth = require('../controllers/auth');
var _project = require('../controllers/project');
var _interface = require('../controllers/interface');
var _mock = require('../controllers/mock');
var _backup = require('../controllers/backup');


// 登陆
router.post('/login', _auth.loginPost);
// 登出
router.get('/logout', _auth.logout);
// 获取个人信息
router.get('/loginInfo', _auth.loginCheck, _auth.loginInfo);
// 获取projectList
router.get('/projects', _project.getList);
// 删除某个project
router.delete('/projects/:id', _auth.loginCheck, _project.delete);
// 新建project
router.post('/projects', _auth.loginCheck, _project.create);

// 根据入参返回mock规则
router.post('/projects/:pId/interfaces/mock', _mock.postMockRule);
// 客户端直接获取mock规则
router.get('/projects/:pId/interfaces/:id/mock', _mock.getMockRule);

// 获取interfaceList
router.get('/projects/:pId/interfaces/', _interface.getList);
// 获取当前接口的历史版本
router.get('/historys/:pId/interfaces/:id', _interface.getVersionList);
// 获取接口文档
router.get('/projects/:pId/interfaces/excel', _interface.exportExcel);
// 获取某个interface详情
router.get('/projects/:pId/interfaces/:id', _interface.getDetail);
// 根据 _id 获取某个interface详情
router.get('/historys/:id', _interface.getHistoryDetail);
// 从已录入的接口复制一个新的interface
router.get('/projects/:pId/interfaces/copy/:id', _auth.loginCheck, _interface.copy);
// 删除某个interface
router.delete('/projects/:pId/interfaces/:id', _auth.loginCheck, _interface.delete);

// 编辑interface
router.post('/projects/:pId/interfaces/:id', _auth.loginCheck, _interface.edit);
// 新建interface
router.post('/projects/:pId/interfaces/', _auth.loginCheck, _interface.create);

// 上传需要恢复的 mongodb mock 数据库
router.post('/restore/', _auth.loginCheck, upload.single('file'), _backup.restore);
router.get('/restore/history', _auth.loginCheck, _backup.history);

module.exports = router;