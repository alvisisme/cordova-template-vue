const path = require('path')

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
 }
}
