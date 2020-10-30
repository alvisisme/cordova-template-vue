/**
 * 统一挂载全局函数和变量等
 */
import _ from 'lodash'

export default {
  install(Vue) {
    // 挂载的函数等统一使用 $ 前缀
    Vue.prototype.$_ = _
  }
}
