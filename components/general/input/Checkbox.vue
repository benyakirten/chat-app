<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

function handleUpdate(e: Event) {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }

  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="checkbox">
    <label>
      <slot></slot>
      <input type="checkbox" :checked="modelValue" @input="handleUpdate" />
    </label>
  </div>
</template>

<style scoped>
/* TODO: Style this */
</style>
