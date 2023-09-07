<script setup lang="ts">
const { open } = defineProps<{ open: boolean }>()
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <Teleport to="body">
    <dialog
      :open="open"
      v-bind="$attrs"
    >
      <slot></slot>
    </dialog>
  </Teleport>
</template>

