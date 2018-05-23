# mock-server
mock平台是一个为项目开发团队提供项目接口管理和随机生成模拟数据的Web服务。使用者可以在mock服务端定义项目接口，并配置接口请求参数与响应参数的[mock规则](http://mockjs.com/)。客户端会根据项目接口地址拦截前端发出的AJAX请求，并根据配置返回符合mock规则的随机模拟数据。开发者可以使用该平台实现前后端分离，独立进行接口的开发与调试，大大增加了开发效率。
mock-server是mock平台的服务端部分，为使用者提供接口的管理与mock规则配置，并且为客户端提供返回mock规则的接口支持。

# mock-sersver 技术栈
mock-server 使用最新技术搭建，主要包含

* [react](http://facebook.github.io/react/)
* [react-rou0ter](https://github.com/ReactTraining/react-router)
* [express](https://expressjs.com/)
* [mongoose](http://mongoosejs.com/)

# 目录结构说明
```
    bin(执行脚本)

    client(客户端应用,react组件及路由)

    server(服务端应用,接口及数据库配置)

    public(静态资源目录)
    
    process.json(pm2配置文件)
    
    nodemon.json(nodemon配置文件,用于开发环境启动项目)
    
    webpack.dll.config.babel.js(一次性打包所有依赖模块，加快webpack编译速度)
```


# 启动服务
## 开发环境
开发环境下使用nodemon启动服务器，方便进行配置和调试。
```
npm install -g nodemon
npm run dev
```

## 正式环境
正式环境使用pm2启动服务器，用于同时启用多个服务。
```
npm install pm2@latest -g
npm start
```

# 接口文档
## 用户信息接口列表
---
| | |
|:-------------:|:-------------|
| [/api/login](#login) | 登录 |
| [/api/logout](#logout) | 登出 |
| [/api/loginInfo](#login-info) | 获取用户信息 |

## 用户信息接口详情
### 登陆
#### 是否需要验证
是
#### 请求类型
POST
#### 请求参数
| | 必选 | 类型 | 说明 |
|:-------------:|:-------------|:-------------|:-------------|
| username | true | string | 用户名 |
| password | true | string | 密码 |

#### 调用样例
```
/api/login
```
#### 返回结果
**登陆成功**
```
{
    code: 0,
    msg: "success"
}
```
**登录失败**
```
{
    code: 3,
    msg: "用户名或密码不正确"
}
```

### 登出
#### 是否需要验证
否
#### 请求类型
GET
#### 请求参数
无
#### 调用样例
```
/api/logout
```
#### 返回结果
无
### 获取用户信息
#### 是否需要验证
是
#### 请求类型
GET
#### 请求参数
无
#### 调用样例
```
/api/loginInfo
```
#### 返回结果
```
{
    "code": 0, 
    "data": {
        "email": "zhangsan@jd.com", 
        "fullname": "张三", 
        "hrmDeptId": "000", 
        "mobile": "18800000000", 
        "orgId": "0000000", 
        "orgName": "前端研发部", 
        "personId": "00000000", 
        "userId": 000000, 
        "username": "zhangsan"
    }
}
```

## 项目信息接口列表
---
| | |
|:-------------:|:-------------|
| [/api/projects](#获取项目列表) | 获取项目列表 |
| [/api/projects](#创建项目) | 创建项目 |
| [/api/projects/:id](#删除项目) | 删除项目 |

## 项目信息接口详情
### 获取项目列表
#### 是否需要验证
否
#### 请求类型
GET
#### 请求参数
无
#### 调用样例
```
/api/projects
```
#### 返回结果
**请求成功**
```
{
    "code": 0, 
    "msg": "success", 
    "data": {
        "title": "项目列表", 
        "projectList": [
            {
                "_id": "57de670f0291c42b206cbfdd", 
                "username": "panshiyao", 
                "name": "测试项目二", 
                "description": "数据多级嵌套的测试~~", 
                "updatetime": "2016-09-18T10:06:07.374Z", 
                "createtime": "2016-09-18T10:06:07.373Z", 
                "__v": 0
            }
        ]
    }
}
```
**请求失败**
```
{
    code: 3,
    msg: '获取项目列表错误'
}
```

### 创建项目
#### 是否需要验证
是
#### 请求类型
POST
#### 请求参数
```
{
    name:proName,
    description:proDescription
}
```
#### 调用样例
```
/api/projects
```
#### 返回结果
**请求成功**
```
{
    "code": 0, 
    "msg": "success", 
    "data": {
        "__v": 0, 
        "username": "zhangsan", 
        "name": "proName", 
        "description": "proDescription", 
        "_id": "57e1184fb447f90428e2d89a", 
        "updatetime": "2016-09-20T11:06:55.895Z", 
        "createtime": "2016-09-20T11:06:55.894Z"
    }
}
```
**请求失败**
```
{
    code: 3,
    msg: '创建项目数据库操作错误',
    data: err obj
}
```
### 删除项目
#### 是否需要验证
是
#### 请求类型
DELETE
#### 请求参数
无
#### 调用样例
```
/api/projects/:pId
```
#### 返回结果
**请求成功**
```
{
    "code": 0, 
    "msg": "success", 
    "data": {
        "__v": 0, 
        "username": "zhangsan", 
        "name": "proName", 
        "description": "proDescription", 
        "_id": "57e1184fb447f90428e2d89a", 
        "updatetime": "2016-09-20T11:06:55.895Z", 
        "createtime": "2016-09-20T11:06:55.894Z"
    }
}
```
**请求失败**
```
{
    code: 3,
    msg: '删除项目数据库操作错误',
    data: err object
}
```

## 接口信息接口列表
---
| | |
|:-------------:|:-------------|
| [/api/projects/:pId/interfaces](#获取接口列表) | 获取接口列表 |
| [/api/projects/:pId/interfaces](#添加接口) | 添加接口 |
| [/api/projects/:pId/interfaces/:id](#删除接口) | 删除接口 |
| [/api/projects/:pId/interfaces/:id](#获取某一接口详情) | 获取某一接口详情 |
| [/api/projects/:pId/interfaces/:id](#更新某一接口信息) | 更新某一接口信息 |

## 接口信息接口详情
### 获取接口列表
#### 是否需要验证
否
#### 请求类型
GET
#### 请求参数
无
#### 调用样例
```
/api/projects/:pid/interfaces/
```
#### 返回结果
**请求成功**
```
{
    "code": 0, 
    "msg": "success", 
    "data": {
        "title": "接口列表", 
        "interfaceList": [
            {
                "_id": "57de69a00291c42b206cbfde", 
                "pId": "57de670f0291c42b206cbfdd", 
                "uId": "00314554", 
                "name": "获取员工信息", 
                "description": "获取全部员工的全部信息&这是一条很长的描述这是一条很长的描述这是一条很长的描述这是一条很长的描述这是一条很长的描述这是一条很长的描述", 
                "uri": "api/employees/", 
                "type": "get", 
                "__v": 2, 
                "resParams": [], 
                "reqParams": [], 
                "updatetime": "1474193824221", 
                "createtime": "1474193824220"
            }
        ]
    }
}
```
**请求失败**
```
{
    code: 3,
    msg: '数据库查询接口列表出现错误',
    data: err object
}
```

### 添加接口
#### 是否需要验证
是
#### 请求类型
POST
#### 请求参数
```
{
    name:"interface name",
    description:"interface description",
    reqParams:[],
    resParams:[],
    type:"get",
    uri::"datelist.json"
}
```
#### 调用样例
```
/api/projects/57de670f0291c42b206cbfdd
```
#### 返回结果
**请求成功**
```
{
    "code": 0, 
    "msg": "success", 
    "data": {
        "__v": 0, 
        "pId": "57de670f0291c42b206cbfdd", 
        "uId": "00314554", 
        "name": "interface name", 
        "description": "interface description", 
        "uri": "datelist.json", 
        "type": "get", 
        "_id": "57e11bb9f95e8410e4054d5e", 
        "resParams": [ ], 
        "reqParams": [ ], 
        "updatetime": "1474370489858", 
        "createtime": "1474370489858"
    }
}
```
**请求失败**
```
{
    code: 3,
    msg: '创建接口数据库操作错误',
    data: err
}
```
### 删除接口
#### 是否需要验证
是
#### 请求类型
DELETE
#### 请求参数
无
#### 调用样例
```
/api/projects/:pId/interfaces/:id
```
#### 返回结果
**请求成功**
```
{
    "code": 0, 
    "msg": "success", 
    "data": {
        "__v": 0, 
        "pId": "57de670f0291c42b206cbfdd", 
        "uId": "00314554", 
        "name": "interface name", 
        "description": "interface description", 
        "uri": "datelist.json", 
        "type": "get", 
        "_id": "57e11bb9f95e8410e4054d5e", 
        "resParams": [ ], 
        "reqParams": [ ], 
        "updatetime": "1474370489858", 
        "createtime": "1474370489858"
    }
}
```
**请求失败**
```
{
    code: 3,
    msg: '删除接口操作数据库错误',
    data: err object
}
```

### 获取某一接口详情
#### 是否需要验证
否
#### 请求类型
GET
#### 请求参数
无
#### 调用样例
```
/api/projects/:pId/interfaces/:id
```
#### 返回结果
**请求成功**
```
{
    "code": 0, 
    "msg": "success", 
    "data": {
        "__v": 0, 
        "pId": "57de670f0291c42b206cbfdd", 
        "uId": "00314554", 
        "name": "interface name", 
        "description": "interface description", 
        "uri": "datelist.json", 
        "type": "get", 
        "_id": "57e11bb9f95e8410e4054d5e", 
        "resParams": [ ], 
        "reqParams": [ ], 
        "updatetime": "1474370489858", 
        "createtime": "1474370489858"
    }
}
```
**请求失败**
```
{
    code: 3,
    msg: '数据库获取接口详情出现错误',
    data: err object
}
```

### 更新某一接口信息
#### 是否需要验证
是
#### 请求类型
POST
#### 请求参数
```
{
    name:"interface name",
    description:"interface description",
    reqParams:[],
    resParams:[],
    type:"get",
    uri::"datelist.json"
}
```
#### 调用样例
```
/api/projects/:pId/interfaces/:id
```
#### 返回结果
**请求成功**
```
{
    "code": 0, 
    "msg": "success", 
    "data": {
        "__v": 0, 
        "pId": "57de670f0291c42b206cbfdd", 
        "uId": "00314554", 
        "name": "interface name", 
        "description": "interface description", 
        "uri": "datelist.json", 
        "type": "get", 
        "_id": "57e11bb9f95e8410e4054d5e", 
        "resParams": [ ], 
        "reqParams": [ ], 
        "updatetime": "1474370489858", 
        "createtime": "1474370489858"
    }
}
```
**请求失败**
```
{
    code: 3,
    msg: '数据库更新接口详情出现错误',
    data: err object
}
```

## MOCK规则接口列表
---
| | |
|:-------------:|:-------------|
| [/api/projects/:pId/interfaces/mock](#根据入参返回mock规则) | 根据入参返回mock规则 |
| [/api/projects/:pId/interfaces/:id/mock](#客户端直接获取mock规则) | 客户端直接获取mock规则 |


## MOCK规则接口详情
### 根据入参返回mock规则
#### 是否需要验证
是
#### 请求类型
POST
#### 请求参数
```
{
    reqParams: [
        {key: "0", rule: "", type: "Number", description: "数据id", name: "id"}
    ],
    resParams: [
        {name: "status|0-1", description: "相应状态码", type: "Number", rule: "", key: "0"}
    ]
}
```
#### 调用样例
```
/api/projects/:pId/interfaces/mock
```
#### 返回结果
**请求成功**
```
{
    "code": 0, 
    "message": "success", 
    "data": "{\"status|0-1\":289,\"message\":function(){return this.status? '请求成功' : '请求失败'},\"data\":{\"title\":'@title',\"createAt\":'@date',\"content\":'@paragraph(2)'}}"
}
```
**请求失败**
```
{
    code: 3,
    msg: 'data formatting error'
}
```

### 客户端直接获取mock规则
#### 是否需要验证
否
#### 请求类型
GET
#### 请求参数
无
#### 调用样例
```
/api/projects/:pId/interfaces/:id/mock
```
#### 返回结果
**请求成功**
```
{
    "code": 0, 
    "message": "success", 
    "data": "{\"status|0-1\":289,\"message\":function(){return this.status? '请求成功' : '请求失败'},\"data\":{\"title\":'@title',\"createAt\":'@date',\"content\":'@paragraph(2)'}}"
}
```
**请求失败**
```
{
    code: 3,
    msg: '查找数据库失败',
    data: err
}
```
