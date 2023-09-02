<script setup lang="ts">
const { title, size, type } = withDefaults(
  defineProps<{ title: string, size: string, type?: 'submit' | 'button' }>(),
  { type: 'button' }
)
const emits = defineEmits<{
  (e: 'click', event: Event): void
}>()
</script>

<template>
  <button :type="type" class="icon-button" :aria-label="title" @click.stop="emits('click', $event)">
    <GeneralTooltip :disable-click="true">
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
