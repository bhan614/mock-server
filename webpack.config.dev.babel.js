var path = require('path');
var webpack = require('webpack');
var hotDevServer = 'webpack/hot/dev-server';
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
var bathPath = './client';


module.exports = {
    debug: true,
    // devtool: 'source-map', //生成 source map文件
    stats: {
        colors: true, //打印日志显示颜色
        reasons: true //打印相关模块被引入
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json', '.css']
    },
    entry: {
        index: [hotDevServer, hotMiddlewareScript, bathPath + '/index.js'],
        login: [hotDevServer, hotMiddlewareScript,bathPath + '/login.js'],
        vendor: ['react', 'react-dom', 'react-router', 'jquery']
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),  // 打包的路径
        publicPath: '/dist/',  // 静态资源地址的重构路径
        filename: "bundle.[name].js"
    },
    watch: true,
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/i,
                exclude: /(node_modules|bower_components|presets)/,
                loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
                include: path.resolve(__dirname, bathPath)
            }, {
                test: /\.js$/i,
                exclude: /(node_modules|bower_components|presets)/,
                loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
                include: './mock.js'
            }, {
                test: /\.css$/i,
                loader: "style-loader!css-loader"
            }, {
                test: /.*\.(gif|png|jpe?g|svg)$/i,
                loaders: ['file?hash=sha512&digest=hex&name=./img/[hash].[ext]']
            }
        ]
    }
};