<template>
  <div class="about">
    <h1>{{ message | capitalize({ onlyFirstLetter: true }) }}</h1>
  </div>
</template>

<script>
export default {
  name: 'About',
  computed: {
    message() {
      return this.$store.state.about.message
    }
  }
}
</script>
