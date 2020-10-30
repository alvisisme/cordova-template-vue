/**
 * 全局过滤器自动注册
 *
 * 利用 webpack 的 require.context，在编译时
 * 自动扫描和加载本目录下的所有自定义指令
 *
 * 一些常用的过滤器可以参考 https://github.com/freearhey/vue2-filters
 */
import Vue from 'vue'

const requireContext = require.context('@/filters/', true, /.*\.js$/)
const keys = requireContext.keys()
for (const filePath of keys) {
  // example: ./capitalize.js
  if (filePath.split('/').length !== 2 || filePath === './index.js') {
    // 跳过子目录
    continue
  }
  const VueFilters = requireContext(filePath)
  // 自动注册全局过滤器
  Object.keys(VueFilters).forEach(key => {
    Vue.filter(key, VueFilters[key])
  })
}
