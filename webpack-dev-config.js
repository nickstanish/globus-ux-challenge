const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig = {
  devtool: 'source-map',
  entry: [
    './node_modules/webpack/hot/dev-server.js',
    'es6-promise/auto',
    'whatwg-fetch',
    './src/js/main.js'
  ],
  output: {
    libraryTarget: 'umd',
    path: "./public",
    publicPath: "public",
    filename: "js/dist.js"
  },
  stats: {
    colors: true
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ["src/js", "src", "node_modules"]
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        include: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /.less$/,
        loader: ExtractTextPlugin.extract('style?sourceMap', '!css?sourceMap!less?sourceMap')
      }
    ]
  },
  plugins: [
      new ExtractTextPlugin('css/styles.css')
  ],
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: 'index.html'
    }
  }
};

module.exports = webpackConfig;
