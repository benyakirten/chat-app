<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'

import { isTextInputFocused } from '@/lib/dom'
import { withinRange } from '@/lib/numbers'

const props = defineProps<{ open: boolean; initialFocusCallback?: () => HTMLElement }>()
defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits<{ (e: 'close'): void }>()

const dialog = ref<HTMLDialogElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && !isTextInputFocused()) {
    emit('close')
  }
}

function detectBackdropClick(e: MouseEvent) {
  if (!props.open || e.target instanceof HTMLButtonElement || !dialog.value || !dialog.value.open) {
    return
  }

  const { clientX, clientY } = e
  const { x, y, width, height } = dialog.value.getBoundingClientRect()

  if (!withinRange(clientX, x, x + width) || !withinRange(clientY, y, y + height)) {
    emit('close')
  }
}

watchEffect(() => {
  if (props.open) {
    dialog.value?.showModal()
    props.initialFocusCallback?.()
    return
  }
  dialog.value?.close()
})

onMounted(() => {
  window.addEventListener('click', detectBackdropClick)
  return () => window.removeEventListener('click', detectBackdropClick)
})
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="dialog" @keydown="handleKeydown" v-bind="$attrs">
      <button class="dialog-close" ref="button" aria-label="Close Modal" @click="emit('close')">
        <XMarkIcon />
      </button>
      <slot></slot>
    </dialog>
  </Teleport>
</template>

<style scoped>
.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  min-height: 2rem;
  min-width: 2rem;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    transition: all 400ms ease;
  }

  &[open]::backdrop {
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
  }

  &-close {
    transition: transform var(--time-200) ease;

    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;

    &:focus,
    &:hover {
      transform: scale(0.8);
    }

    &:active {
      transform: scale(0.7);
    }
  }
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: backdrop-filter var(--time-400) ease, opacity var(--time-400) ease;
  backdrop-filter: blur(4px);
}

.backdrop-enter-from,
.backdrop-leave-to {
  backdrop-filter: blur(0px);
  opacity: 0;
}
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}
</style>
