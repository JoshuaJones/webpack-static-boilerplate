const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(__dirname, '/app/index.html'),
  filename: 'index.html',
  inject: 'body'
});
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const isProduction = (process.env.NODE_ENV === 'production');

// Config objects for repeated use
const cssLoaderConfig = {
  url: false,
  minimize: true
};

module.exports = {
  context: path.resolve('app'),
  entry: './js/main.js',
  output: {
    filename: './js/main.js',
    path: path.resolve('dist'),
    // publicPath: '/js/'
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }, {
        test: /\.scss$/,
        use: (isProduction) ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: cssLoaderConfig
          }, { loader: 'sass-loader' }]
        }) : [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: cssLoaderConfig
        }, {
          loader: 'sass-loader'
        }]
      }
    ]
  },
  plugins: [
    HTMLWebpackPluginConfig,
    new ExtractTextPlugin('./css/main.css'),
    new CopyWebpackPlugin([{
      from: './images',
      to: './images'
    }]),
    new ImageminPlugin({
      disable: !isProduction,
      test: /\.(jpe?g|png|gif)$/i,
      pngquant: {
        quality: '95-100'
      }
    })
  ]
};
