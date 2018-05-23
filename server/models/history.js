/**
 * 接口编辑历史的数据库模型
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var History = new Schema({
  pId : String, // project id
  iId : String, // interface id
  user: Schema.Types.Mixed,
  name: {
    type: String,
    required: [true, '名称不能为空'],
    maxlength: [32, '标题长度不能超过32个字符']
  },
  description: {
    type: String
  },
  uri: {
    type: String,
    required: [true, '接口地址不能为空']
  },
  type: {
    type: String,
    required: [true, '请求类型不能为空']
  },
  reqParams : Array,     // 录入的原始参数的数组
  resParams : Array,     
  reqMockRule: String,   // 根据录入参数构建出的Mock规则
  resMockRule: String,
  createtime: {
    type: String,
    default: Date.now
  },
  updatetime: {
    type: String,
    default: Date.now
  }
});

module.exports = mongoose.model('History', History);