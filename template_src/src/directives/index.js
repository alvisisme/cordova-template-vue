/**
 * 利用 webpack 的 require.context，在编译时
 * 自动扫描和加载本目录下的所有自定义指令
 */
const requireContext = require.context('@/directives/', true, /.*\.js$/)
const keys = requireContext.keys()
for (const filePath of keys) {
  // example: ./vfocus.js
  if (filePath.split('/').length !== 2 || filePath === './index.js') {
    // 跳过子目录
    continue
  }
  requireContext(filePath)
}
