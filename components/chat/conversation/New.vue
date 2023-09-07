<script setup lang="ts">
// import { Multiselect}

const { open } = defineProps<{ open: boolean }>()
</script>

<template>
  <BaseModal @close="$emit('close')" :open="open">
    <p>I am a pretty teapot</p>
    <button>I am a button</button>
  </BaseModal>
</template>
