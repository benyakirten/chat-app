<script setup lang="ts">
const { title, size } = defineProps<{ title: string, size: string }>()
const emits = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button class="icon-button" :aria-label="title" @click.stop="emits('click')">
    <GeneralTooltip>
      <template #content>
        {{ title }}
      </template>
      <slot></slot>
    </GeneralTooltip>
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-block;
  width: v-bind(size);
  height: v-bind(size);
}
</style>
