const path = require('path')
const webpack = require('webpack')
const V8LazyParseWebpackPlugin = require('v8-lazy-parse-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'development'
const isProd = nodeEnv === 'production'

module.exports = {
  devtool: isProd ? 'hidden-source-map' : 'cheap-eval-source-map',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader?sourceMap!css-loader?sourceMap'
      },
      {
        test: /\.sass$/,
        loader: 'style-loader?sourceMap!css-loader?sourceMap!sass-loader?sourceMap'
      },
      {
        test: /\.woff(\?.*)?$/,
        loader: 'url-loader',
        query: {
          prefix: 'fonts/',
          name: '[path][name].[ext]',
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.woff2(\?.*)?$/,
        loader: 'url-loader',
        query: {
          prefix: 'fonts/',
          name: '[path][name].[ext]',
          limit: 10000,
          mimetype: 'application/font-woff2'
        }
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: 'url-loader',
        query: {
          prefix: 'fonts/',
          name: '[path][name].[ext]',
          limit: 10000,
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: 'url-loader',
        query: {
          prefix: 'fonts/',
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url-loader',
        query: {
          prefix: 'fonts/',
          name: '[path][name].[ext]',
          limit: 10000,
          mimetype: 'image/svg+xml'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
    new V8LazyParseWebpackPlugin()
  ],
  target: 'electron',
  electron: {
    __dirname: true
  },
  node: {
    __dirname: true
  }
}
