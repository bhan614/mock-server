/**
 * 环境配置 开发环境
 */

module.exports.PORT = process.env.PORT = 9999;
module.exports.NODE_ENV = process.env.NODE_ENV = 'development';
module.exports.SSA_URL = process.env.SSA_URL = ''; //ssa单点登录授权地址
module.exports.DB_URL = process.env.DB_URL = 'mongodb://'; //mongodb开发环境

module.exports.checkUserUrl = process.env.checkUserUrl = '';
module.exports.redirectUrl = process.env.redirectUrl = '';
