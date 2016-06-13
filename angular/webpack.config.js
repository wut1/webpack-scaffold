var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
      index: path.resolve(__dirname, 'src/index.js'),
      vendor:['jquery','angular','angular-ui-router','oclazyload']//第三方代码抽离
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
      inline: true,
      contentBase: './build',
      port: 8080,
      stats: { colors: true }
    },
     module: {
      loaders: [
          {
            test: /\.css/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
          },
          {
            test: /\.(png|jpg)$/,
            loader: 'url?limit=8192'
          },
          {
            test: /\.(woff|woff2|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url?limit=10000"
          }
          { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" }//提升jquery至全局变量
      ]
    },
    plugins: [
      //css提取
      new ExtractTextPlugin("bundle.css"),
      //公共第三方代码抽离
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
      //压缩
      new uglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.MinChunkSizePlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.DefinePlugin({
        __DEV__: true//配置魔法全局变量
      }),
      //压缩优化
      // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
      new webpack.optimize.DedupePlugin(),
      // 按引用频度来排序 ID，以便达到减少文件大小的效果
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin({
          minSizeReduce: 1.5,
          moveToParents: true
      }),
      new HtmlWebpackPlugin({
        title: '无用',
        template: 'src/index.html',//模板文件
        filename: 'index.html', //输出目录以build为路径
        hash: true,//hash值
      })
    ]
};