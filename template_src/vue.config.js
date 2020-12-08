const path = require('path')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const vConsolePlugin = require('vconsole-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// 启动时自动生成应用插件配置文件
require('./hooks/generate_plugin_config')

const smp = new SpeedMeasurePlugin()

const IS_DEV = process.env.NODE_ENV === 'development'
const IS_PROD = process.env.NODE_ENV === 'production'
const ANALYZE_BUILD_PERFORMANCE = process.env.ANALYZE_BUILD_PERFORMANCE === 'true'

const resolve = dir => {
  return path.join(__dirname, dir)
}

const plugins = []
const configureWebpack = {
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  optimization: {},
  plugins
}

if (IS_DEV) {
  plugins.push(new StylelintPlugin({
    files: ['src/**/*.vue', 'src/**.*.less'],
    fix: true // 打开自动修复时需要小心，不要再上面的配置中加入js或者html文件，会发生问题，请手动修复
  }))
}

// eslint-disable-next-line new-cap
plugins.push(new vConsolePlugin({
  enable: process.env.VCONSOLE_ENABLE === 'true'
}))

if (IS_PROD) {
  const pure_funcs = process.env.NO_CONSOLE_LOG === 'true' ? ['window.console.log'] : []
  configureWebpack.optimization.minimizer = [
    new TerserPlugin({
      sourceMap: false,
      terserOptions: {
        compress: {
          pure_funcs
        }
      }
    })
  ]
}

module.exports = {
  publicPath: '',
  outputDir: 'www',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/styles/variable.less')
      ]
    }
  },
  configureWebpack: ANALYZE_BUILD_PERFORMANCE ? smp.wrap(configureWebpack) : configureWebpack,
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('cache-loader')
      .loader('cache-loader')
      .end()
  }
}
