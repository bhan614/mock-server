/**
 * 接口的数据库模型
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Interface = new Schema({
  pId : String,
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

// Interface.pre('save', function(next){
//   /*更新最后编辑时间*/
//   this.updatetime = Date.now();
//   /*更新最后操作人*/
//   var username = '（' + this.user.fullname + '）' ;
//   if(!this.name.match(/（.+）$/)) {
//     this.name += username;
//   } else {
//     this.name = this.name.replace(/（.+）$/, username);
//   }
//   next();
// });


module.exports = mongoose.model('Interface', Interface);