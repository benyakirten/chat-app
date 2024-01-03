<script lang="ts" setup>
await navigateTo('/chat')
</script>

<template>
  <div class="index-loader">
    <GeneralLoading size="1.6rem" />
  </div>
</template>

<style scoped>
.index-loader {
  display: grid;
  place-items: center;
  height: 100vh;
  width: 100vw;
}
</style>
