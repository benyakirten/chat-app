<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'

import { isClickWithinElement, isTextInputFocused } from '@/lib/dom'

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
  if (e.target instanceof HTMLButtonElement || !dialog.value || !dialog.value.open) {
    return
  }

  if (!isClickWithinElement(e, dialog.value)) {
    emit('close')
  }
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      dialog.value?.showModal()
      props.initialFocusCallback ? props.initialFocusCallback() : button.value?.focus()
      return
    }
    dialog.value?.close()
  }
)

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
    transition: all var(--time-300) ease;
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
</style>
