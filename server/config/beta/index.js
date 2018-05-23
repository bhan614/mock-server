/**
 * 环境配置 功能或闭环
 */

module.exports.PORT = process.env.PORT = 8900;
module.exports.NODE_ENV = process.env.NODE_ENV = 'beta';
module.exports.SSA_URL = process.env.SSA_URL = ''; //ssa单点登录授权地址
module.exports.DB_URL = process.env.DB_URL = ''; //mongodb闭环

module.exports.checkUserUrl = process.env.checkUserUrl = '';
module.exports.redirectUrl = process.env.redirectUrl = '';
