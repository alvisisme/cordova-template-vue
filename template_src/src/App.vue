<template>
  <div id="app" class="c-App">
    <div id="nav" class="c-App-nav">
      <router-link to="/" class="c-App-link">Home</router-link> |
      <router-link to="/about" class="c-App-link">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="less">
.c-App {
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.c-App-nav {
  padding: 30px;
}

.c-App-link {
  color: #2c3e50;
  font-weight: bold;
}

/* postcss-bem-linter: ignore */
.c-App-link .router-link-exact-active {
  color: @theme-color;
}
</style>
