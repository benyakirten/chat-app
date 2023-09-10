<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
</script>

<template>
  <div class="checkbox">
    <label>
      <slot></slot>
      <input type="checkbox" :value="modelValue" @input="$emit('update:modelValue', $event)" />
    </label>
  </div>
</template>

<style scoped>
/* TODO: Style this */
</style>
