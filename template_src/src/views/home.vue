<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" class="animate__animated animate__bounce">
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/hello-world.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
