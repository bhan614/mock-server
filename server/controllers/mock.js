/**
 * mock处理逻辑
 */
var InterfaceModel = require('../models/interface.js');
var mockGenerator = require('../helper/utils').mockGenerator;

var Mock = {
    /*根据入参返回mock规则*/
    postMockRule: function(req, res, next) {
        if (Array.isArray(req.body.resParams)) {
            try {
                var mockRule = mockGenerator(req.body.resParams);

                res.send({
                    code: 0,
                    message: 'success',
                    data: mockRule
                })
            } catch (e) {
                console.log('获取mock规则出错啦....');
                next(e);
            }
        } else {
            res.send({
                code: 3,
                message: 'Error in Mock postMockRule！'
            })
        }


    },
    /*客户端获取mock规则*/
    getMockRule: function(req, res, next) {
        InterfaceModel.findOne({_id: req.params.id}, function(err, result) {
            if (err) {
                console.log(JSON.stringify(err));
                var responseData = {
                    code: 3,
                    msg: 'Error in Mock getMockRule！',
                    data: err
                };
                res.json(responseData);
            } else {
                var reqMockRule = result.reqMockRule;
                var resMockRule = result.resMockRule;
                res.json({
                    code: 0,
                    message: 'success',
                    data: {
                        reqMockRule: reqMockRule,
                        resMockRule: resMockRule
                    }
                })
            }
        })
    }
}

module.exports = Mock;