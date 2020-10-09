<template>
  <div class="HelloWorld">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener" class="c-HelloWorld-link"
        >vue-cli documentation</a
      >.
    </p>
    <h3 class="c-HelloWorld-item">Installed CLI Plugins</h3>
    <ul class="c-HelloWorld-list">
      <li class="c-HelloWorld-listItem">
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
          target="_blank"
          rel="noopener"
          class="c-HelloWorld-link"
          >babel</a
        >
      </li>
      <li class="c-HelloWorld-listItem">
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router"
          target="_blank"
          rel="noopener"
          class="c-HelloWorld-link"
          >router</a
        >
      </li>
      <li class="c-HelloWorld-listItem">
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex"
          target="_blank"
          rel="noopener"
          class="c-HelloWorld-link"
          >vuex</a
        >
      </li>
      <li class="c-HelloWorld-listItem">
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
          target="_blank"
          rel="noopener"
          class="c-HelloWorld-link"
          >eslint</a
        >
      </li>
      <li class="c-HelloWorld-listItem">
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest"
          target="_blank"
          rel="noopener"
          class="c-HelloWorld-link"
          >unit-jest</a
        >
      </li>
    </ul>
    <h3>Essential Links</h3>
    <ul class="c-HelloWorld-list">
      <li class="c-HelloWorld-listItem">
        <a href="https://vuejs.org" target="_blank" rel="noopener" class="c-HelloWorld-link">Core Docs</a>
      </li>
      <li class="c-HelloWorld-listItem">
        <a href="https://forum.vuejs.org" target="_blank" rel="noopener" class="c-HelloWorld-link"
          >Forum</a
        >
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank" rel="noopener" class="c-HelloWorld-link"
          >Community Chat</a
        >
      </li>
      <li class="c-HelloWorld-listItem">
        <a href="https://twitter.com/vuejs" target="_blank" rel="noopener" class="c-HelloWorld-link"
          >Twitter</a
        >
      </li>
      <li class="c-HelloWorld-listItem">
        <a href="https://news.vuejs.org" target="_blank" rel="noopener" class="c-HelloWorld-link">News</a>
      </li>
    </ul>
    <h3>Ecosystem</h3>
    <ul class="c-HelloWorld-list">
      <li class="c-HelloWorld-listItem">
        <a href="https://router.vuejs.org" target="_blank" rel="noopener" class="c-HelloWorld-link"
          >vue-router</a
        >
      </li>
      <li class="c-HelloWorld-listItem">
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener" class="c-HelloWorld-link">vuex</a>
      </li>
      <li class="c-HelloWorld-listItem">
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
          class="c-HelloWorld-link"
          >vue-devtools</a
        >
      </li>
      <li class="c-HelloWorld-listItem">
        <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener" class="c-HelloWorld-link"
          >vue-loader</a
        >
      </li>
      <li class="c-HelloWorld-listItem">
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
          rel="noopener"
          class="c-HelloWorld-link"
          >awesome-vue</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.c-HelloWorld-item {
  margin: 40px 0 0;
}

.c-HelloWorld-list {
  padding: 0;
  list-style-type: none;
}

.c-HelloWorld-listItem {
  display: inline-block;
  margin: 0 10px;
}

.c-HelloWorld-link {
  color: #42b983;
}

// h3 {
//   margin: 40px 0 0;
// }

// ul {
//   padding: 0;
//   list-style-type: none;
// }

// li {
//   display: inline-block;
//   margin: 0 10px;
// }

// a {
//   color: #42b983;
// }
</style>
