<template>
  <div class="about">
    <h1>{{ message | capitalize({ onlyFirstLetter: true }) }}</h1>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      message: 'this is an about page'
    }
  }
}
</script>
