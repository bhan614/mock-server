/**
 * 备份控制器
 */
const fs = require('fs')
const async = require('async')
const mongoose = require('mongoose')
const InterfaceModel = require('../models/interface')
const ProjectModel = require('../models/project')
const Interface = require('../controllers/interface')

// 清空表数据
const cleanTableData = function (model, fn) {
  model.remove({}, function () {
    fn()
  })
}

// 恢复 interfaces 表
const createInterfaces = function (res, data) {
  let fns = []
  data.forEach((d) => {
    // console.log(d)
    if (!d) return
    d = JSON.parse(d)
    d._id = new mongoose.Types.ObjectId(d._id['$oid'])
    // console.log(d)
    const InterfaceEntity = new InterfaceModel(d)
    fns.push(function (callback) {
      InterfaceEntity.save(function (err, p) {
        if (err) {
          callback(err)
        } else {
          callback(null, p)
        }
      })
    })
  })

  async.parallel(fns, function (err, result) {
    if (err) {
      return res.json({
        code: 3,
        msg: err
      });
    }

    res.json({
      code: 0,
      msg: '恢复项目数据库操作成功'
    })
  })
}

// 恢复 projects 表
const createProject = function (res, data) {
  let fns = []
  data.forEach((d) => {
    // console.log(d)
    if (!d) return
    d = JSON.parse(d)
    d._id = new mongoose.Types.ObjectId(d._id['$oid'])
    d.createtime = new Date(d.createtime['$date'])
    d.updatetime = new Date(d.updatetime['$date'])
    // console.log(d)
    const ProjectEntity = new ProjectModel(d)
    fns.push(function (callback) {
      ProjectEntity.save(function (err, p) {
        if (err) {
          callback(err)
        } else {
          callback(null, p)
        }
      })
    })
  })

  async.parallel(fns, function (err, result) {
    if (err) {
      return res.json({
        code: 3,
        msg: err
      });
    }

    res.json({
      code: 0,
      msg: '恢复项目数据库操作成功'
    })
  })
}

module.exports = {
  /**
   * 恢复 mock 数据库数据
   * @param req
   * @param res
   * @param next
   */
  restore: function (req, res, next) {
    const file = req.file
    const name = file.originalname
    const buffer = req.file.buffer
    // console.log(buffer.toString(), name)
    if (!buffer) {
      return res.json({
        code: 3,
        msg: '文件不存在'
      })
    }

    let data = buffer.toString()
    try {
      data = data.split('\n')
      if (name === 'interfaces.json') {
        cleanTableData(InterfaceModel, function () {
          createInterfaces(res, data)
        })
      } else if (name === 'projects.json') {
        cleanTableData(ProjectModel, function () {
          createProject(res, data)
        })
      }
    } catch (e) {
      res.json({
        code: 3,
        msg: '文件格式错误，请上传json格式文件',
        data: e.message
      })
    }
  },
  /**
   * 生成 history 表，将 interface 表中接口数据进行备份，生成接口历史版本
   * @param req
   * @param res
   * @param next
   */
  history: function (req, res, next) {
    const errors = []
    try {

      InterfaceModel.find({}, function (err, result) {
        if (err) {
          res.json({
            code: 3,
            msg: '查询数据库的过程中出现了问题，请联系管理员:(',
            data: err
          });
        } else {
          result.forEach(function (d, i) {
            // console.log(d.name, i)
            Interface.history(d, (error) => {
              if (error) {
                errors.push({
                  data: d,
                  error
                })
              }
            })
          })

          if (errors.length) {
            res.json({
              code: 3,
              msg: '数据处理的过程中出现了问题，请联系管理员:(',
              data: errors
            });
          } else {
            res.json({
              code: 0,
              msg: '操作成功'
            })
          }
        }
      });
    } catch (e) {
      res.json({
        code: 3,
        msg: '数据处理失败，请稍后再试',
        data: e.message
      })
    }
  }
}