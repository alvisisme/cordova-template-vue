import router from './router'
import store from './store'
export default {
  id: 'about',
  router,
  store,
  hooks: {
    async onAppInit() {
      window.console.log('plugin about init')
    }
  }
}
