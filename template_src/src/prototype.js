/**
 * 统一挂载全局函数和变量等
 */
import _ from 'lodash'

export default {
  install(Vue) {
    Vue.prototype.$_ = _
  }
}
