<script setup lang="ts">
  // 
</script>

<template>
  <h2>THIS IS {{ $route.fullPath }}</h2>
  <NuxtLink to="/">HOME</NuxtLink>
  <NuxtLink to="/about">ABOUT</NuxtLink>
  <NuxtLink to="/messages">MESSAGES</NuxtLink>

  <main>
    <slot></slot>
  </main>
</template>
