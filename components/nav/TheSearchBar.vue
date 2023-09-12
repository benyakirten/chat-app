<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

const searchText = ref('')
</script>

<template>
  <GeneralInputText v-model="searchText" placeholder="Search..." disabled aria-label="Global Search">
    <template #icon>
      <MagnifyingGlassIcon />
    </template>
  </GeneralInputText>
</template>
