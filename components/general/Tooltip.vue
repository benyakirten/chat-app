<script setup lang="ts">
const { direction, debounceTimeout } = withDefaults(
  defineProps<{ direction?: 'top' | 'bottom' | 'left' | 'right', debounceTimeout?: number }>(),
  { direction: 'top', debounceTimeout: 800 }
)

const hovered = ref(true)
const timeout = ref<NodeJS.Timeout | null>(null)

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

watch(() => hovered.value, val => console.log(val))

const tooltipDirectionClass = computed(() => `tooltip-content-${direction}`)
</script>

<template>
  <!-- Not sure why these events are not triggering -->
  <span class="tooltip" @mouseenter="handleMouseEnter" @click.stop="hovered = !hovered" @mouseleave="handleMouseLeave">
    <Transition name="tooltip">
      <div v-if="hovered" class="tooltip-content" :class="tooltipDirectionClass">
        <slot :hovered="hovered" name="content"></slot>
      </div>
    </Transition>
    <slot></slot>
  </span>
</template>

<style scoped>
.tooltip {
  position: relative;

  &-content {
    background-color: var(--bg-color-alt4);
    /* TODO: Use the popover/anchor API when they are well supported */
    position: absolute;
    z-index: 1;
    padding: 0.25rem 0.5rem;
    width: max-content;
    isolation: isolate;
    border-radius: 2px;

    &::after {
      content: '';
      position: absolute;
      width: 0.25rem;
      height: 0.35rem;
      background-color: inherit;
      top: 0;
      left: 0;
    }

    &-top {
      top: -100%;
      left: 50%;
      /* Extra distance for tail */
      transform: translate(-50%, calc(-50% - 0.35rem));

      &::after {
        top: 100%;
        left: 50%;
        width: 0.5rem;
        transform: translateX(-50%);
        clip-path: polygon(50% 100%, 0 0, 100% 0);
      }
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

.tooltip-enter-active,
.tooltip-leave-active {
  transition: all var(--time-400);
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
