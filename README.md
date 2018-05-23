# mock-server
mock平台是一个为项目开发团队提供项目接口管理和随机生成模拟数据的Web服务。使用者可以在mock服务端定义项目接口，并配置接口请求参数与响应参数的[mock规则](http://mockjs.com/)。客户端会根据项目接口地址拦截前端发出的AJAX请求，并根据配置返回符合mock规则的随机模拟数据。开发者可以使用该平台实现前后端分离，独立进行接口的开发与调试，大大增加了开发效率。
mock-server是mock平台的服务端部分，为使用者提供接口的管理与mock规则配置，并且为客户端提供返回mock规则的接口支持。

## 环境配置
- [nodeJS](https://nodejs.org)
- [mongoDB](https://www.mongodb.com/)
- [pm2](http://pm2.keymetrics.io/)
