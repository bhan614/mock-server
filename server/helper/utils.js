/**
 * 基础的工具方法
 * @type {request}
 */
var request = require('request');
var Promise = require('bluebird');
var crypto = require('crypto');
var Mock = require('mockjs');

/**
 * md5加密字符串
 * @param str
 * @returns {*}
 */
exports.md5 = function(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};


/**
 * 返回的json数据格式
 * @param json
 * @param code
 * @param msg
 * @returns {{code: (number|*), msg: (*|string), data: *}}
 */
exports.ajaxJSON = function(json, code, msg) {
    code = (typeof code == 'undefined') ? 1 : code;
    if (code === 0) {
        msg = json;
        json = null;
    }
    return {
        code: code,
        msg: msg || '',
        data: json
    };
}


/**
 * 表单提交
 * @param options
 */
exports.remotePostForm = function(options) {
    return new Promise(function(resolve, reject) {
        request.post(
            {
                url: options.url,
                form: options.data || {}
            },
            function(err, response, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            }
        );
    });
}

/**
 * json提交
 * @param options
 */
exports.remotePostJSON = function(options) {
    return new Promise(function(resolve, reject) {
        request.post(
            {
                url: options.url,
                json: options.data || {}
            },
            function(err, response, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            }
        );
    });
}

/**
 * get获取json数据
 * @param url
 */
exports.remoteGetJSON = function(url) {
    return new Promise(function(resolve, reject) {
        request.get({
                url: url,
                json: {}
            },
            function(err, response, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            }
        );
    });
}

/**
 * 根据输入的参数数组返回一个mock规则对象
 */
exports.mockGenerator = function(arrOfParams) {
    return (function _m(arrOfParams) {
        var arrOfKeyVals = [];
        arrOfParams.forEach(function(param) {
            var sKey = '"' + param.name + '":';
            var sMockRule = param.rule.match(/^@mock=(.*)$/) ? param.rule.match(/^@mock=(.*)$/)[1] : '';
            switch (param.type) {
                case 'Object': {
                    if (param.children) {
                        arrOfKeyVals.push(sKey + _m(param.children));
                    }
                    break;
                }

                case 'ArrayObject': {
                    if (!param.children || param.children.length == 0) {
                        break;
                    }
                    var childparam = _m(param.children);
                    arrOfKeyVals.push(sKey + "[" + childparam + "]");
                    break;
                }

                case 'Boolean': {
                    if (sMockRule) {
                        arrOfKeyVals.push(sKey + sMockRule);
                    } else {
                        sMockRule = Math.random() < 0.5 ? 'true' : 'false';
                        arrOfKeyVals.push(sKey + sMockRule);
                    }
                    break;
                }

                case 'Number': {
                    if (sMockRule) {
                        arrOfKeyVals.push(sKey + sMockRule);
                    } else {
                        sMockRule = '' + Math.ceil(Math.random() * 1000);
                        arrOfKeyVals.push(sKey + sMockRule);
                    }
                    break;
                }

                default: {
                    if (sMockRule) {
                        if (sMockRule.match(/^[@$].*$/)) {
                            arrOfKeyVals.push(sKey + "'" + sMockRule + "'");
                        } else {
                            arrOfKeyVals.push(sKey + sMockRule);
                        }
                    }
                    break;
                }
            }
        })
        return "{" + arrOfKeyVals + "}";
    })(arrOfParams);
}

/**
 * 根据文档动态生成接口
 */
exports.dynamicApi = function(interfaceDoc, router) {
    var uri = '/' + interfaceDoc.pId + (interfaceDoc.uri.indexOf('/') === 0 ? interfaceDoc.uri : ('/' + interfaceDoc.uri))
    console.log(uri);

    router.get(uri, function(req, res) {
        var resMockData = Mock.mock(eval('(' + interfaceDoc.resMockRule + ')'));
        res.send(resMockData);
    })

    if (interfaceDoc.type == 'post') {
        router.post(uri, function(req, res) {
            var reqParams = paramsVerify(req.body);
            if (reqParams.isValid) {
                var resMockData = Mock.mock(eval('(' + interfaceDoc.resMockRule + ')'));
                res.send(resMockData);
            } else {
                res.send(reqParams.data);
            }
        })
    }

    /**
     * 验证入参是否符合定义
     */
    function paramsVerify(reqParams, reqMockRule) {
        // 需要在数据库中增加参数必要性判断
        // 代码主体
        // 符合定义返回{isValid: true, data: reqParams}
        // 不符合定义返回{isValid: false, data: 'xx is not String'}
        return {isValid: true, data: reqParams};
    }
}

