<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{ open: boolean; initialFocusCallback?: () => HTMLElement }>()
defineOptions({
  inheritAttrs: false,
})
useAddMountedEventCallback('click', detectBackdropClick)

const emit = defineEmits<{ (e: 'close'): void }>()
const dialog = ref<HTMLDialogElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
function handleKeydown(e: KeyboardEvent) {
  if (props.open && e.key === 'Escape' && !isTextInputFocused()) {
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
  (open) => {
    if (open) {
      dialog.value?.showModal()
      props.initialFocusCallback ? props.initialFocusCallback() : button.value?.focus()
      return
    }
    dialog.value?.close()
  }
)
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
  /* TODO: Make This look better in regards to color */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  min-height: 2rem;
  min-width: 2rem;

  background-color: var(--bg-color-alt4);
  color: var(--primary-text);
  border: 2px solid var(--neutral);

  &::backdrop {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    transition: all var(--time-300) ease;
    z-index: 99;
  }

  &[open]::backdrop {
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
  }

  &-close {
    transition: transform var(--time-200) ease;
    color: var(--highlight);

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
