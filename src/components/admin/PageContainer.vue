<script setup>
const props = defineProps({
  userInfo: {
    type: Object
  },
  title: {
    type: String
  }
})

</script>

<template>
  <div class="container">
    <header class="header"></header>
    <div class="title"></div>
    <div class="body"></div>
    <footer class="footer"></footer>
  </div>
</template>

<style scoped>

</style>
