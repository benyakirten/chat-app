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
    hoverColor?: string
  }>(),
  { type: 'button', disabled: false, color: 'var(--highlight)', hoverColor: 'var(--bg-color-primary)' }
)
</script>

<template>
  <button :type="type" class="button" :aria-label="title" :disabled="disabled">
    <GeneralTooltip :disable-click="true">
      <template #content>
        {{ title }}
      </template>
      <!-- TODO: Make these styles standardized according to theme -->
      <component :is="icon" :class="{ disabled: disabled }" class="button-icon" />
    </GeneralTooltip>
  </button>
</template>

<style scoped>
.button {
  display: inline-block;
  width: v-bind(size);
  height: v-bind(size);

  &-icon {
    color: v-bind(color);

    transition: all 400ms ease;

    &:hover {
      color: v-bind(hoverColor);
      animation: twitch 3000ms ease infinite alternate;
    }

    &.disabled {
      color: var(--neutral);

      &:hover {
        color: currentColor;
      }
    }
  }
}

@keyframes twitch {
  0%,
  100% {
    scale: 1;
  }
  50% {
    scale: 1.1;
  }
}
</style>
