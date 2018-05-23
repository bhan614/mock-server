/**
 * 项目控制器
 */

'use strict';

var async = require('async'),
    ajaxJSON = require('../helper/utils').ajaxJSON,
    ProjectModel = require('../models/project'),
    ProjectApi = require('../models/api')(ProjectModel),
    logger = require('../helper/mylogger').Logger;

var Project = {

  /**
   * 展示页面控制器
   * @param req
   * @param res
   * @param next
   */
  getList : function(req,res,next){
    async.parallel({
      projectList : function(callback){
        ProjectApi.find({},function (err,doc) {
          if(err){
            callback('获取项目列表错误');
          }else{
            callback(null,doc);
          }
        })
      }
    },function (err,result) {

      if(err) {
        var responseData = {
          code: 3,
          msg: err
        };
        res.json(responseData);
      } else {

        var responseData = {
          code: 0,
          msg: 'success',
          data: {
            title : '项目列表',
            projectList : result.projectList
          }
        };
        res.json(responseData);
      }
    })
  },

  /**
   * 创建新的项目
   * @param req
   * @param res
   * @param next
   */
  create : function (req,res,next) {
    var ProjectEntity = new ProjectModel({
      username : req.session.user.username,
      name : req.body.name,
      description : req.body.description
    });
    ProjectEntity.save(function (err, project) {
      if(err) {
        var responseData = {
          code: 3,
          msg: '创建项目数据库操作错误',
          data: err
        };
        res.json(responseData);
      } else {
        var responseData = {
          code: 0,
          msg: 'success',
          data: project
        };
        res.json(responseData);
      }   
    })
  },
  /**
   * 编辑
   * @param req
   * @param res
   * @param next
   */
  edit : function (req,res,next) {
    
  },

  /**
   * 删除项目
   * @param req
   * @param res
   * @param next
   */
  delete : function (req,res,next) {
    var id = req.params.id || req.query.id || req.body.id;

    ProjectApi.delete(id,function (err, doc) {
      if(err) {
        var responseData = {
          code: 3,
          msg: '删除项目数据库操作错误',
          data: err
        };
        res.json(responseData);
      } else {
        logger.info(new Date() + ' project removed, data:' + JSON.stringify(doc) + ',removed by:' + JSON.stringify(req.session.user) + '.');
        var responseData = {
          code: 0,
          msg: 'success',
          data: doc
        };
        res.json(responseData);
      }
    })
  }
}
module.exports = Project;