import Vue from 'vue'
import VueRouter from 'vue-router'
import 'normalize.css'
import 'animate.css'

import App from '@/app.vue'
import routes from '@/router'
import store from '@/store'
import VuePrototype from '@/prototype'
import '@/filters'
import '@/directives'
import PluginManager from '@/core/plugin-manager'

Vue.use(VueRouter)
Vue.use(VuePrototype)

Vue.config.productionTip = false

const requireContext = require.context('@/plugins/', true, /.*\/bootstrap\.js$/)
const keys = requireContext.keys()
for (const filePath of keys) {
  if (filePath.split('/').length !== 3) {
    continue
  }
  const { default: plugin } = requireContext(filePath)
  PluginManager.add(plugin)
  // router
  if (plugin.router) {
    routes.push(...plugin.router)
  }
  // store
  if (plugin.store) {
    store.registerModule(plugin.id, plugin.store)
  }
}

const router = new VueRouter({
  routes
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
