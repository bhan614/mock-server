/**
 * Created by tanxiangyuan on 2016/11/24.
 */
const onFinished = require('on-finished');
module.exports.create = function (logger) {

    return function (req, res, next) {
        const start = process.hrtime();

        onFinished(res, (err, res1) => {
            const end = process.hrtime();
            const ms = ((end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6).toFixed(3);
            // const _log = `${req.method} ${decodeURIComponent(req.originalUrl || req.url)} ${res1.statusCode || undefined} ${ms} ms - ${res1['content-length']}`;
            //开了Gzip拿不到content-length
            const _log = `${req.method} ${decodeURIComponent(req.originalUrl || req.url)} ${res1.statusCode || undefined} ${ms} ms`;
            if (req.method === 'HEAD') {//nginx会发定时发Head请求，监测系统健康状况，把这部分请求降级
                logger.debug(_log);
            } else {
                logger.info(_log);
                if (req.path === '/') {
                    logger.info(`request headers:[${JSON.stringify(req.headers)}]`);
                }
            }
        });

        next();
    };
};