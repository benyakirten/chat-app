<script setup lang="ts">
const hovered = ref(false)
const timeout = ref<NodeJS.Timeout | null>(null)
const { direction, debounceTimeout } = withDefaults(defineProps<{ direction: 'top' | 'bottom' | 'left' | 'right', debounceTimeout: number }>(), {
  debounceTimeout: 800
})

// Should this be a hook?
function handleMouseEnter() {
  timeout.value = setTimeout(() => {
    hovered.value = true
    timeout.value = null
  }, debounceTimeout)
}

function handleMouseLeave() {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }
  hovered.value = false
}

const tooltipDirectionClass = computed(() => `tooltip-content-${direction}`)
</script>

<template>
  <span class="tooltip" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="tooltip-content" :class="tooltipDirectionClass">
      <slot name="content"></slot>
    </div>
    <slot name="hoverable"></slot>
  </span>
</template>

<style scoped>
.tooltip {
  position: relative;

  &-content {
    &-top {
      /*  */
    }

    &-bottom {
      /*  */
    }

    &-right {
      /*  */
    }

    &-left {
      /*  */
    }
  }
}
</style>
