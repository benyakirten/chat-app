<script setup lang="ts">
import { v4 as uuid } from "uuid";

const { direction, debounceTimeout, id } = withDefaults(
  defineProps<{ direction?: 'top' | 'bottom' | 'left' | 'right', debounceTimeout?: number, id?: string }>(),
  { direction: 'top', debounceTimeout: 1600, id: uuid() }
)

const hovered = ref(false)
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

const tooltipDirectionClass = computed(() => `tooltip-content-${direction}`)
</script>

<template>
  <!-- Not sure why these events are not triggering -->
  <span class="tooltip">
    <Transition name="tooltip">
      <div :id="id" role="tooltip" v-if="hovered" class="tooltip-content" :class="tooltipDirectionClass">
        <slot :hovered="hovered" name="content"></slot>
      </div>
    </Transition>
    <span @keydown.escape="hovered = false" @mouseover="handleMouseEnter" @click.stop="hovered = !hovered"
      @mouseleave="handleMouseLeave" :aria-describedby="id">
      <slot></slot>
    </span>
  </span>
</template>

<style scoped>
.tooltip {
  position: relative;

  &-content {
    background-color: var(--bg-color-alt4);
    /* TODO: Use the popover/anchor API when they are well supported */
    /* TODO: Use variables to make code more DRY */
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
      bottom: 0;
      left: 50%;
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
      bottom: -100%;
      left: 50%;
      transform: translate(-50%, calc(50% + 0.35rem));

      &::after {
        top: -0.35rem;
        left: 50%;
        width: 0.5rem;
        transform: translateX(-50%);
        clip-path: polygon(100% 100%, 0% 100%, 50% 0);
      }
    }

    &-right {
      top: 50%;
      right: -100%;
      transform: translate(calc(-25% - 0.35rem), -50%);

      &::after {
        top: 50%;
        left: -0.35rem;
        width: 0.35rem;
        height: 0.35rem;
        transform: translateY(-50%);
        clip-path: polygon(100% 0, 100% 100%, 0 50%);
      }
    }

    &-left {
      top: 50%;
      right: 100%;
      transform: translate(-0.35rem, -50%);

      &::after {
        top: 50%;
        left: 100%;
        width: 0.35rem;
        height: 0.35rem;
        transform: translateY(-50%);
        clip-path: polygon(100% 50%, 0% 100%, 0 0);
      }
    }
  }
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: all var(--time-300) ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
