import Vue from 'vue'
import 'normalize.css'
import 'animate.css'

import App from '@/app.vue'
import router from '@/router'
import store from '@/store'
import VuePrototype from '@/prototype'
import * as VueFilters from '@/filters'

Vue.use(VuePrototype)
// 注册全局过滤器
Object.keys(VueFilters).forEach(key => {
  Vue.filter(key, VueFilters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
