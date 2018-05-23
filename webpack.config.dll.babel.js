var path = require('path');
var webpack = require('webpack');

module.exports =  {
  entry: {
    vendor: ['react', 'react-dom', 'redux', 'redux-thunk', 'react-redux', 'react-router',
      'react-router-redux', 'history']
  },

  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].dll.js',
    /**
     * output.library
     * 将会定义为 window.${output.library}
     * 在这次的例子中，将会定义为`window.vendorLibrary`
     */
    library: '[name]Library'
  },
  plugins: [
    new webpack.DllPlugin({
      /**
       * path
       * 定义 manifest 文件生成的位置
       * [name]的部分由entry的名字替换
       */
      path: path.join(__dirname, 'public', '[name]-manifest.json'),
      /**
       * name
       * dll bundle 输出到那个全局变量上
       * 和 output.library 一样即可。
       */
      name: '[name]Library'
    })
  ]
};
