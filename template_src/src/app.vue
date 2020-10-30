<template>
  <div id="app" class="app-App">
    <div id="nav" class="app-App-nav">
      <router-link to="/" class="app-App-link">Home</router-link> |
      <router-link to="/about" class="app-App-link">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
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
