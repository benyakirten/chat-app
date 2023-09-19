<script setup lang="ts">
import { v4 as uuid } from 'uuid'

const props = withDefaults(
  defineProps<{
    direction?: TooltipDirection
    debounceTimeout?: number
    id?: string
    disableClick?: boolean
  }>(),
  { direction: 'top', debounceTimeout: 800, id: uuid(), disableClick: false }
)

const tooltipState = ref<'hovered' | 'clicked' | 'hidden'>('hidden')
const { clear, debouncer } = useDebounce(() => (tooltipState.value = 'hovered'), props.debounceTimeout)

function handleMouseLeave() {
  clear()

  if (tooltipState.value === 'hovered') {
    tooltipState.value = 'hidden'
  }
}

function handleClick(e: Event) {
  if (props.disableClick) {
    clear()
    tooltipState.value = 'hidden'
    return
  }

  e.stopPropagation()
  tooltipState.value = tooltipState.value === 'hidden' ? 'clicked' : 'hidden'
}

const tooltipDirectionClass = computed(() => `tooltip-content-${props.direction}`)

const tooltipListener = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    tooltipState.value = 'hidden'
  }
}

useAddMountedEventCallback('keydown', tooltipListener)
</script>

<template>
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
/* TODO: This is a mess and will drastically need to be changed */
/* Tooltips should be able to host elements/components */
.tooltip {
  /* TODO: Get tooltip positioning to work correctly for all items */
  position: relative;

  &-content {
    --dist-wide: 1.5rem;
    --dist-high: 0.6rem;

    position: absolute;
    z-index: var(--z-high);
    background-color: var(--bg-alt3);
    font-size: var(--text-lg);
    color: var(--text);

    padding: 0.4rem 0.5rem;
    width: max-content;
    isolation: isolate;

    border-radius: 4px;
    border: 1px solid var(--highlight);

    &::after {
      content: '';
      position: absolute;
      width: var(--dist-wide);
      height: var(--dist-high);
      background-color: inherit;
      top: 0;
      left: 0;
      background-color: var(--highlight);
    }

    &-top {
      bottom: 0.5rem;
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
      left: 50%;
      transform: translate(-50%, calc(50% + 0.35rem));

      &::after {
        left: 50%;
        top: calc(-1 * var(--dist-high));
        width: 0.5rem;
        transform: translateX(-50%);
        clip-path: polygon(100% 100%, 0% 100%, 50% 0);
      }
    }

    &-right,
    &-left {
      top: 50%;

      &::after {
        top: 50%;
        width: calc(var(--dist-wide) / 2);
        height: calc(var(--dist-high) / 2);
        transform: translateY(-50%);
      }
    }

    &-right {
      left: 105%;
      transform: translate(calc(var(--dist-high) / 2), -50%);

      &::after {
        left: calc(var(--dist-wide) / -2);
        clip-path: polygon(100% 0, 100% 100%, 0 50%);
      }
    }

    &-left {
      right: 100%;
      transform: translate(calc(-1 * var(--dist-high)), -50%);

      &::after {
        left: 100%;
        clip-path: polygon(100% 50%, 0% 100%, 0 0);
      }
    }
  }
}

.tooltip-enter-active {
  transition: all 200ms ease;
}

.tooltip-leave-active {
  transition: all 100ms ease 50ms;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  filter: blur(1rem);
  scale: 0.5;
}
</style>
