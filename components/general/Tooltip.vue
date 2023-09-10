<script setup lang="ts">
import { v4 as uuid } from 'uuid'

const { direction, debounceTimeout, id, disableClick } = withDefaults(
  defineProps<{
    direction?: 'top' | 'bottom' | 'left' | 'right'
    debounceTimeout?: number
    id?: string
    disableClick?: boolean
  }>(),
  { direction: 'top', debounceTimeout: 800, id: uuid(), disableClick: false }
)

const tooltipState = ref<'hovered' | 'clicked' | 'hidden'>('hidden')

const timeout = ref<NodeJS.Timeout | null>(null)
const { clear, debouncer } = useDebounce(() => (tooltipState.value = 'hovered'), debounceTimeout)

function handleMouseLeave() {
  clear()

  if (tooltipState.value === 'hovered') {
    tooltipState.value = 'hidden'
  }
}

function handleClick(e: Event) {
  if (disableClick) {
    clear()
    tooltipState.value = 'hidden'
    return
  }

  e.stopPropagation()
  tooltipState.value = tooltipState.value === 'hidden' ? 'clicked' : 'hidden'
}

const tooltipDirectionClass = computed(() => `tooltip-content-${direction}`)

const tooltipListener = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    tooltipState.value = 'hidden'
  }
}

useAddMountedEventCallback('keydown', tooltipListener)
</script>

<template>
  <!-- Not sure why these events are not triggering -->
  <span
    class="tooltip"
    @mouseover="debouncer"
    @click="handleClick"
    @mouseleave="handleMouseLeave"
    @mouseout="handleMouseLeave"
  >
    <Transition name="tooltip">
      <div
        :id="id"
        role="tooltip"
        v-if="tooltipState !== 'hidden'"
        class="tooltip-content"
        :class="tooltipDirectionClass"
      >
        <slot :state="tooltipState" name="content"></slot>
      </div>
    </Transition>
    <span :aria-describedby="id">
      <slot></slot>
    </span>
  </span>
</template>

<style scoped>
.tooltip {
  /* TODO: Get tooltip positioning to work correctly for all items */
  position: relative;

  &-content {
    background-color: var(--bg-color-alt4);
    /* TODO: Use the popover/anchor API when they are well supported */
    /* TODO: Use variables to make code more DRY */
    position: absolute;
    z-index: 2;
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

.tooltip-enter-active {
  transition: all var(--time-300) ease;
  transform-origin: center;
}

.tooltip-leave-active {
  transition: all var(--time-300) ease var(--time-100);
  transform-origin: center;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  filter: blur(1rem);
  scale: 0.5;
}
</style>
