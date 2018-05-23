/**
 * 项目的数据库模型
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Project = new Schema({
  username : {
    type : String,
    required: [true, '用户不能为空']
  },
  name: {
    type: String,
    required: [true, '项目名称不能为空'],
    maxlength: [32, '标题长度不能超过32个字符'],
    unique: [true, '项目已经被创建']
  },
  description: {
    type: String,
    required: [true, '描述不能为空']
  },
  createtime: {
    type: Date,
    default: Date.now
  },
  updatetime: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Project', Project);