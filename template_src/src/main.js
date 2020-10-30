import Vue from 'vue'
import 'normalize.css'
import 'animate.css'

import App from '@/app.vue'
import router from '@/router'
import store from '@/store'
import VuePrototype from '@/prototype'
import '@/filters'
import '@/directives'

Vue.use(VuePrototype)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
