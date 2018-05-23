/**
 * 接口控制器
 */
var InterfaceModel = require('../models/interface.js');
var ProjectModel = require('../models/project.js');
var HistoryModel = require('../models/history');
var mockGenerator = require('../helper/utils').mockGenerator;
var mongoose = require('mongoose');
var XLSX = require('xlsx-style');
var logger = require('../helper/mylogger').Logger;

var Interfaces = {
  getList: function (req, res, next) {
    var pId = req.params.pId;
    InterfaceModel.find({pId: pId}, function (err, result) {
      if (err) {
        var responseData = {
          code: 3,
          msg: '查询数据库的过程中出现了问题，请联系管理员:(',
          data: err
        };
        res.json(responseData);
      } else {

        var responseData = {
          code: 0,
          msg: 'success',
          data: {
            title: '接口列表',
            interfaceList: result
          }
        };
        responseData.data.interfaceList.sort(function (a, b) {
          // return a.uri.localeCompare(b.uri);
          return a.createtime - b.createtime;
        })
        res.json(responseData);
      }
    });
  },
  // 获取当前接口的历史版本
  getVersionList: function (req, res, next) {
    var pId = req.params.pId;
    var iId = req.params.id;
    HistoryModel.find({pId, iId}, function (err, result) {
      if (err) {
        var responseData = {
          code: 3,
          msg: '查询数据库的过程中出现了问题，请联系管理员:(',
          data: err
        };
        res.json(responseData);
      } else {
        var responseData = {
          code: 0,
          msg: 'success',
          data: {
            title: '接口列表',
            interfaceList: result
          }
        };
        responseData.data.interfaceList.sort(function (a, b) {
          return b.updatetime - a.updatetime;
        })
        res.json(responseData);
      }
    });
  },
  edit: function (req, res, next) {
    /*编辑*/
    var id = req.params.id;
    var reqMockRule = req.body.reqParams.length > 0 ? mockGenerator(req.body.reqParams) : '{}';
    var resMockRule = req.body.resParams.length > 0 ? mockGenerator(req.body.resParams) : '{}';

    InterfaceModel.findOne({_id: id}, function (err, result) {
      if (err) {
        var responseData = {
          code: 1,
          msg: '查询数据库的过程中出现了问题，请联系管理员:(',
          data: err
        };
        res.json(responseData);
      } else {
        delete req.body.__v;
        Object.assign(result, req.body, {
          user: req.session.user,
          reqMockRule: reqMockRule,
          resMockRule: resMockRule,
          updatetime: Number(new Date)
        });
        result.save(function (err, result) {
          if (err) {
            var responseData = {
              code: 3,
              msg: '接口保存失败了，不要动哦，请联系管理员~',
              data: err
            };
            res.json(responseData);
          } else {
            //dynamicApi(result, router);
            var responseData = {
              code: 0,
              msg: 'success',
              data: result
            };
            res.json(responseData);
            Interfaces.history(result)
          }
        });
      }
    })
  },
  create: function (req, res, next) {
    /*新建*/
    var reqMockRule = req.body.reqParams.length > 0 ? mockGenerator(req.body.reqParams) : '{}';
    var resMockRule = req.body.resParams.length > 0 ? mockGenerator(req.body.resParams) : '{}';
    var InterfaceData = Object.assign({
      pId: req.params.pId,
      user: req.session.user,
      reqMockRule: reqMockRule,
      resMockRule: resMockRule
    }, req.body);
    var InterfaceEntity = new InterfaceModel(InterfaceData);

    InterfaceEntity.save(function (err, result) {
      if (err) {
        var responseData = {
          code: 3,
          msg: '接口保存失败了，不要动哦，请联系管理员~',
          data: err
        };
        res.json(responseData);
      } else {
        var responseData = {
          code: 0,
          msg: 'success',
          data: result
        };
        res.json(responseData);
        Interfaces.history(result)
      }
    })
  },
  getDetail: function (req, res, next) {
    var id = req.params.id;
    InterfaceModel.findOne({_id: id}, function (err, result) {
      if (err) {
        var responseData = {
          code: 3,
          msg: '查询数据库的过程中出现了问题，请联系管理员:(',
          data: err
        };
        res.json(responseData);
      } else {
        var responseData = {
          code: 0,
          msg: 'success',
          data: result
        };
        res.json(responseData);
      }
    })
  },
  delete: function (req, res, next) {
    var id = req.params.id;
    return new Promise(function (resovle, reject) {
      InterfaceModel.findOne({_id: id}, function (err, result) {
        if (err) {
          return reject(err);
        } else {
          resovle(result);
        }
      });
    }).then(function (entity) {
      InterfaceModel.remove({_id: id}, function (err, result) {
        if (err) {
          return Promise.reject(err);
        } else {
          logger.info(new Date() + ' interface removed, entity:' + JSON.stringify(entity) + ',removed by:' + JSON.stringify(req.session.user) + '.');
          var responseData = {
            code: 0,
            msg: 'success',
            data: result
          };
          res.json(responseData);
        }
      })
    }).catch(function (err) {
      var responseData = {
        code: 3,
        msg: 'Error in Interface delete！',
        data: err
      };
      res.json(responseData);
    });
  },
  copy: function (req, res, next) {
    var pId = req.params.pId,
      id = req.params.id;
    InterfaceModel.findOne({_id: id}, function (err, result) {
      if (err) {
        var responseData = {
          code: 3,
          msg: 'Error in Interface copy！',
          data: err
        };
        res.json(responseData);
      } else {
        var copied = result.toObject();
        copied.name += '_副本';
        Object.assign(copied, {
          user: req.session.user,
          updatetime: Number(new Date)
        });
        var InterfaceEntity = new InterfaceModel(copied);
        InterfaceEntity._id = new mongoose.Types.ObjectId();
        InterfaceEntity.save(function (err, result) {
          if (err) {
            console.info(err);
            var responseData = {
              code: 3,
              msg: '拷贝接口失败',
              data: err
            };
            res.json(responseData);
          } else {
            var responseData = {
              code: 0,
              msg: '拷贝接口成功',
              data: result
            };
            res.json(responseData);
            Interfaces.history(result)
          }
        })
      }
    })
  },
  exportExcel: function (req, res, next) {
    var pId = req.params.pId;
    var getProjectName = new Promise(function (resolve, reject) {
      ProjectModel.findOne({_id: pId}, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.name);
        }
      });
    });
    getProjectName.then(function (projectName) {
      /*查询接口详情数组*/
      InterfaceModel.find({pId: pId}, function (err, result) {
        if (err) {
          var responseData = {
            code: 3,
            msg: '查询数据库的过程中出现了问题，请联系管理员:(',
            data: err
          };
          res.json(responseData);
        } else {
          /*配置Excel需要的数据格式*/
          /*原格式*/
          var sourceArr = result;
          var worksheets = sourceArr.map(function (source) {
            return formatWorkSheet(source);
          });
          /*输出格式*/
          function formatWorkSheet(source) {
            var boldStyle = {
              font: {
                "name": "SimSun",
                bold: true
              },
              "border": {
                "top": {
                  "style": "thin"
                },
                "left": {
                  "style": "thin"
                },
                "right": {
                  "style": "thin"
                },
                "bottom": {
                  "style": "thin"
                }
              }
            };
            var borderStyle = {
              "border": {
                "top": {
                  "style": "thin"
                },
                "left": {
                  "style": "thin"
                },
                "right": {
                  "style": "thin"
                },
                "bottom": {
                  "style": "thin"
                }
              }
            };
            var Topic = {
              "A1": {"v": "接口名", "s": boldStyle, "t": "s"},   // bolder border
              "B1": {"v": source.name, "s": borderStyle, "t": "s"},   // merge
              "C1": {"v": "", "s": borderStyle, "t": "s"},
              "A2": {"v": "接口描述", "s": boldStyle, "t": "s"},   // bolder
              "B2": {"v": source.description, "s": borderStyle, "t": "s"},   // merge
              "C2": {"v": "", "s": borderStyle, "t": "s"},
              "A3": {"v": "接口地址", "s": boldStyle, "t": "s"},   // bolder
              "B3": {"v": source.uri, "s": borderStyle, "t": "s"},   // merge
              "C3": {"v": "", "s": borderStyle, "t": "s"},
              "A4": {"v": "请求类型", "s": boldStyle, "t": "s"},   // bolder
              "B4": {"v": source.type, "s": borderStyle, "t": "s"},   // merge
              "C4": {"v": "", "s": borderStyle, "t": "s"}
            };

            var expandedReq = reduceDimention(source.reqParams);
            var expandedRes = reduceDimention(source.resParams);
            var reqStartRow = 6;
            var resStartRow = reqStartRow + expandedReq.length + 3;
            var Req = Object.assign({}, formatHeader("请求参数列表", reqStartRow), formatBody(expandedReq, reqStartRow + 2));
            var Res = Object.assign({}, formatHeader("响应参数列表", resStartRow), formatBody(expandedRes, resStartRow + 2));
            var Params = Object.assign({}, Req, Res);
            var worksheet = Object.assign({}, Topic, Params);


            // 获取所有单元格的位置
            var outputPos = Object.keys(worksheet)
            // 计算出范围
            var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            // 列宽
            var wscols = [
              {wch: 9},
              {wch: 9},
              {wch: 9},
              {wch: 9}
            ];
            // 合并单元格
            var wsmerges = [
              {
                "s": {
                  "c": 1,
                  "r": 0
                },
                "e": {
                  "c": 2,
                  "r": 0
                }
              },
              {
                "s": {
                  "c": 1,
                  "r": 1
                },
                "e": {
                  "c": 2,
                  "r": 1
                }
              },
              {
                "s": {
                  "c": 1,
                  "r": 2
                },
                "e": {
                  "c": 2,
                  "r": 2
                }
              },
              {
                "s": {
                  "c": 1,
                  "r": 3
                },
                "e": {
                  "c": 2,
                  "r": 3
                }
              },
              {
                "s": {
                  "c": 0,
                  "r": reqStartRow - 1
                },
                "e": {
                  "c": 2,
                  "r": reqStartRow - 1
                }
              },
              {
                "s": {
                  "c": 0,
                  "r": resStartRow - 1
                },
                "e": {
                  "c": 2,
                  "r": resStartRow - 1
                }
              },
            ];
            // 配置信息
            var configs = {
              '!ref': ref,
              '!cols': wscols,
              '!merges': wsmerges
            };

            return Object.assign({}, worksheet, configs);
          }

          function reduceDimention(dataArr) {
            var _recur = function (dataArr, indent) {
              var result = [];

              dataArr.forEach(function (data) {
                if (typeof data.children !== 'undefined' && data.children.length !== 0) {
                  var tmp = {};
                  for (key in data) {
                    if (key !== "children") {
                      tmp[key] = data[key];
                    }
                  }
                  tmp.indent = indent;
                  result.push(tmp);
                  result.push.apply(result, _recur(data.children, indent + 1));
                } else {
                  data.indent = indent;
                  result.push(data);
                }
              })

              return result;
            }

            return _recur(dataArr, 0)
          }

          function formatHeader(title, startRow) {
            var boldStyle = {
              font: {
                "name": "SimSun",
                bold: true
              },
              "border": {
                "top": {
                  "style": "thin"
                },
                "left": {
                  "style": "thin"
                },
                "right": {
                  "style": "thin"
                },
                "bottom": {
                  "style": "thin"
                }
              }
            };
            var title = {
              ["A" + startRow]: {"v": title, "s": boldStyle, "t": "s"},
              ["B" + startRow]: {"v": "", "s": boldStyle, "t": "s"},
              ["C" + startRow]: {"v": "", "s": boldStyle, "t": "s"}
            }
            var headerArr = ["参数名", "参数类型", "参数说明"];
            var header = headerArr.reduce(function (prev, next, idx) {
              return Object.assign({}, prev, {
                [String.fromCharCode(65 + idx) + (startRow + 1)]: {
                  "v": next,
                  "s": boldStyle,
                  "t": "s"
                }
              });
            }, {});
            return Object.assign({}, title, header);
          }

          function formatBody(expandedData, startRow) {

            var Header = ["name", "type", "description"];
            var borderStyle = {
              "border": {
                "top": {
                  "style": "thin"
                },
                "left": {
                  "style": "thin"
                },
                "right": {
                  "style": "thin"
                },
                "bottom": {
                  "style": "thin"
                }
              }
            }
            return expandedData
              .map(function (obj, row) {
                // 匹配 headers 的位置，生成对应的单元格数据
                // {
                //     "name": obj.name,
                //     "description": obj.description,
                //     "type": obj.type
                // }
                return Header.map(function (key, idx) {
                  var style = Object.assign({}, {"alignment": {"indent": key === "name" ? obj.indent : 0}}, borderStyle);
                  return {
                    "v": obj[key],
                    "s": style,
                    "t": "s",
                    "position": String.fromCharCode(65 + idx) + (startRow + row)
                  }
                })
              })
              .reduce(function (prev, next) {
                // 将二维数组降为一维数组
                // [
                //     [
                //         { "v": obj.name, "s": {}, "t": "s", "position": "A1"},
                //         { "v": obj.type, "s": {}, "t": "s", "position": "B1"}
                //         { "v": obj.description, "s": {}, "t": "s", "position": "C1"}
                //     ],
                //     [
                //         { "v": obj.name, "s": {}, "t": "s", "position": "A2"},
                //         { "v": obj.type, "s": {}, "t": "s", "position": "B2"}
                //         { "v": obj.description, "s": {}, "t": "s", "position": "C2"}
                //     ]
                // ]
                return prev.concat(next);
              }, [])
              .reduce(function (prev, next) {
                // 转变成 worksheet 需要的数据格式
                // {
                //     "A1": {"v": obj.name, "s": {}, "t": "s"},
                //     "B1": {"v": obj.type, "s": {}, "t": "s"},
                //     "C1": {"v": obj.type, "s": {}, "t": "s"},
                //     "A2": {"v": obj.name, "s": {}, "t": "s"},
                //     "B2": {"v": obj.type, "s": {}, "t": "s"},
                //     "C2": {"v": obj.type, "s": {}, "t": "s"},
                // }
                return Object.assign({}, prev, {
                  [next.position]: {
                    "v": next["v"],
                    "s": next["s"],
                    "t": "s"
                  }
                });
              }, {});
          }


          // 构建 workbook 对象
          var wNames = sourceArr.map(function (source) {
            return source.name;
          });
          var wb = {
            SheetNames: wNames,
            Sheets: worksheets.reduce(function (prev, next, index) {
              return Object.assign({}, prev, {[wNames[index]]: next})
            }, {})
          };
          var exported = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
          // saveAs(new Blob([s2ab(exported)], {type: "application/octet-stream"}), "test.xlsx");
          res.setHeader('Content-Type', 'application/vnd.openxmlformats');
          res.setHeader("Content-Disposition", "attachment; filename=" + "newest" + ".xlsx");
          res.end(exported, 'binary');
        }
      })
    })
  },
  history: function (res, callback = () => {
  }) {
    const doc = res.toObject() // mongoose克隆对象
    doc.iId = doc._id
    delete doc._id
    delete doc.__v
    const HistoryEntity = new HistoryModel(doc)
    HistoryEntity.save(function (err, p) {
      if (err) {
        callback(err)
      } else {
        callback(null, p)
      }
    })
  },
  getHistoryDetail: function (req, res, next) {
    var id = req.params.id;
    HistoryModel.findOne({_id: id}, function (err, result) {
      if (err) {
        var responseData = {
          code: 3,
          msg: '查询数据库的过程中出现了问题，请联系管理员:(',
          data: err
        };
        res.json(responseData);
      } else {
        var responseData = {
          code: 0,
          msg: 'success',
          data: result
        };
        res.json(responseData);
      }
    })
  },
}

module.exports = Interfaces;