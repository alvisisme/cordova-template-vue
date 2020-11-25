<template>
  <div
    id="app"
    class="app-App"
  >
    <div
      id="nav"
      class="app-App-nav"
    >
      <router-link
        to="/"
        class="app-App-link"
      >Home</router-link> |
      <router-link
        to="/about"
        class="app-App-link"
      >About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import PermissionFeature from '@/features/permissions'
import FileFeature from '@/features/file'
import PluginManager from '@/core/plugin-manager'

export default {
  name: 'App',
  created() {
    document.addEventListener('deviceready', this.onDeviceReady, false)
    if (!window.cordova) {
      this.onDeviceReady()
    }
  },
  methods: {
    async onDeviceReady() {
      if (PermissionFeature.enabled()) {
        const requestPermission = cordova.plugins.permissions.WRITE_EXTERNAL_STORAGE
        const { hasPermission } = await PermissionFeature.ensurePermission(requestPermission)
        if (!hasPermission) {
          window.console.error('not have WRITE_EXTERNAL_STORAGE permission')
        } else {
          window.console.log('has WRITE_EXTERNAL_STORAGE permission')
        }
        if (FileFeature.enabled()) {
          window.console.log('file feature enabled')
        }
      } else {
        window.console.log('permission feature disabled')
      }

      const plugins = PluginManager.getAll()
      for (const item of plugins) {
        if (this.$_.get(item, 'hooks.onAppInit')) {
          await item.hooks.onAppInit()
        }
      }
    }
  }
}
</script>

<style lang="less">
/** @define App */
.app-App {
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-App-nav {
  padding: 30px;
}

.app-App-link {
  color: #2c3e50;
  font-weight: bold;
}

/* postcss-bem-linter: ignore */
.app-App-link.router-link-exact-active {
  color: @theme-color;
}
</style>
