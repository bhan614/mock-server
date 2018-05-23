/**
 * 入口文件
 */

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const logger = require('./helper/mylogger').Logger;
const compress = require('compression');
const app = express();
const config = require('./config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(compress());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(require('./middlewares/request-logger').create(logger));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

var DB_URL = process.env.DB_URL;

//session信息存储到数据库
app.use(session({
    secret: 'session-secret',
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        // maxAge: 1000 * 60 * 60, //1hour
    },
    store: new MongoStore({
        url: DB_URL,
        collection: 'sessions'
    }),
    resave: true
}));
app.use(flash());


try {
    console.log('准备链接DB：' + DB_URL);
    // var db = mongoose.createConnection();
    // db.openSet(config.dbUrl);
    mongoose.connection.on('open', function () {
        console.log('连接数据库成功');

    });

    mongoose.connection.on('error', function (err) {
        console.log('连接数据库失败');
    });
    mongoose.Promise = require('bluebird'); //fix DeprecationWarning: Mongoose: mpromise  http://mongoosejs.com/docs/promises.html
    mongoose.connect(DB_URL);

} catch (e) {
    console.log('数据库链接失败：', e);
}

// webpack hot middleware
logger.info('[' + app.get('env') + ']');
if (app.get('env') === 'development') {
    var webpackConfig = require('../webpack.config.dev.babel.js');
    var compiler = require('webpack')(webpackConfig);

    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(require("webpack-hot-middleware")(compiler, {
        log: logger.info,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
    }));
}

// load routers
require('./boot')(app, {verbose: !module.parent});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error(`Not Found,${req.url}`);
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    logger.error(err.stack,'..........');
    res.status(err.status || 500);
    res.render('error', {
        title: err.status || 500,
        message: err.message,
        error: err
    });
});


module.exports = app;