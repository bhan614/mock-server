var path = require('path');
var webpack = require('webpack');
var bathPath = './client';


module.exports = {
    debug: false,
    devtool: 'source-map', //生成 source map文件
    stats: {
        colors: true, //打印日志显示颜色
        reasons: true //打印相关模块被引入
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json', '.css']
    },
    entry: {
        index: [bathPath + '/index.js'],
        login: [bathPath + '/login.js']
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),  // 打包的路径
        publicPath: '/dist/',  // 静态资源地址的重构路径
        filename: "bundle.[name].js"
    },
    watch: false,
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            debug: false,
            sourceMap: true,
            output: {
                comments: false
            },
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()

    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.css$/i,
                loader: "style-loader!css-loader"
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)/,
                loader: 'url-loader?name=[hash].[ext]&limit=8192'
            }
        ]
    }
};