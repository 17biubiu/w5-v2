const path = require('path');
const isProd = process.env.NODE_ENV === 'production';
const webpack = require('webpack');
const os = require('os');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ModuleFedSingleRuntimePlugin = require('./moduleFedSingleRuntimePlugin.js');
const config = require('../config');
const { ModuleFederationPlugin } = webpack.container;

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [path.resolve(__dirname, '../src')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: './src/main.js',
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isProd
      ? config.build.assetsPublicPath
      : 'http://localhost:8088/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, '../src'), path.resolve(__dirname, 'node_modules/webpack-dev-server/client')],
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: !isProd
            }
          }]
      },
      ...((config.dev.useEslint && !isProd) ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          isProd
            ? MiniCssExtractPlugin.loader
            : {
                loader: 'vue-style-loader'
              },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          isProd
            ? MiniCssExtractPlugin.loader
            : {
                loader: 'vue-style-loader'
              },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              esModule: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new ModuleFederationPlugin({
      name: 'common',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'common' },
      exposes: {
        './types': './src/constant/types.js',
        './external': './src/constant/external.js'
      }
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, '../src')
    },
    fallback: {
      fs: false,
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: false,
      net: false,
      tls: false,
      child_process: false
    }
  }
};
