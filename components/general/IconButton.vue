<script setup lang="ts">
import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'nuxt/dist/app/compat/capi'

withDefaults(
  defineProps<{
    title: string
    size: string
    icon: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any>
    type?: 'submit' | 'button'
    disabled?: boolean
    color?: string
    hoverColor?: string
    tooltipDirection?: TooltipDirection
  }>(),
  {
    type: 'button',
    disabled: false,
    color: 'var(--accent)',
    hoverColor: 'var(--highlight)',
    tooltipDirection: 'top',
  }
)
</script>

<template>
  <button :type="type" class="button" :aria-label="title" :disabled="disabled">
    <GeneralTooltip :direction="tooltipDirection" :disable-click="true">
      <template #content>
        {{ title }}
      </template>
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
      animation: twitch 3000ms cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite alternate;
    }

    &.disabled {
      color: var(--neutral);
      animation: none;

      &:hover {
        color: var(--neutral);
      }
    }
  }
}

@keyframes twitch {
  0%,
  100% {
    scale: 1;
    rotate: 0deg;
  }
  25% {
    rotate: -12deg;
  }
  50% {
    scale: 1.06;
  }
  75% {
    rotate: 12deg;
  }
}
</style>
