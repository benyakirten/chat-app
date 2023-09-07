<script setup lang="ts">
import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'nuxt/dist/app/compat/capi'

const { title, size, type, icon } = withDefaults(
  defineProps<{
    title: string
    size: string
    icon: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any>
    type?: 'submit' | 'button'
    disabled?: boolean
    color?: string
  }>(),
  { type: 'button', disabled: false, color: 'var(--primary-text)' }
)
</script>

<template>
  <button :type="type" class="icon-button" :aria-label="title" :disabled="disabled">
    <GeneralTooltip :disable-click="true">
      <template #content>
        {{ title }}
      </template>
      <component :is="icon" :style="{ color: disabled ? 'gray' : color, width: size, height: size }" />
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
