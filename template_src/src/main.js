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
// eslint-disable-next-line no-unused-vars
import PluginManager from '@/core/plugin-manager'

Vue.use(VueRouter)
Vue.use(VuePrototype)

Vue.config.productionTip = false

async function main() {
  let plugins

  const requireContext = require.context(
    '@/',
    false,
    /.*\/plugins\.js$/
  )
  const keys = requireContext.keys()
  if (keys.length > 0) {
    plugins = requireContext('./plugins.js').default
  }

  // eslint-disable-next-line no-unused-vars
  for (const pluginInfo of plugins) {
    const { default: plugin } = await pluginInfo.entry()
    plugin.id = pluginInfo.id
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

  routes.push({
    path: '/error',
    name: 'Error',
    component: () => import(/* webpackChunkName: "error" */ '@/views/error')
  })
  routes.push({
    path: '*',
    redirect: '/error'
  })
  const router = new VueRouter({
    routes
  })

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

main().then().catch(err => {
  console.error(err)
})
