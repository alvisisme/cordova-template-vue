const path = require('path')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')

const smp = new SpeedMeasurePlugin()

const IS_DEV = process.env.NODE_ENV === 'development'
const resolve = dir => {
  return path.join(__dirname, dir)
}

const plugins = []
if (IS_DEV) {
  plugins.push(new StylelintPlugin({
    files: ['src/**/*.vue', 'src/**.*.less'],
    fix: true // 打开自动修复时需要小心，不要再上面的配置中加入js或者html文件，会发生问题，请手动修复
  }))
}
const configureWebpack = {
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  plugins
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
  configureWebpack: IS_DEV ? configureWebpack : smp.wrap(configureWebpack),
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
