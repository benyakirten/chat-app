<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{ open: boolean; initialFocusCallback?: () => void }>()
defineOptions({ inheritAttrs: false })
useAddMountedEventCallback('click', detectBackdropClick)

const emit = defineEmits<{ (e: 'close'): void }>()
const dialog = ref<HTMLDialogElement | null>(null)
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
      requestAnimationFrame(() => props.initialFocusCallback?.())
      return
    }
    dialog.value?.close()
  }
)
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="dialog" @keydown="handleKeydown" v-bind="$attrs">
      <GeneralIconButton
        class="dialog-close"
        title="Close Modal"
        @click="emit('close')"
        size="1.2rem"
        :icon="XMarkIcon"
      />
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

  background: radial-gradient(circle, var(--bg-primary), var(--bg-alt3), var(--bg-alt5));
  color: var(--text);
  border: 2px solid var(--neutral);

  &::backdrop {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    transition: all 300ms ease;
    z-index: 99;
  }

  &[open]::backdrop {
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
  }

  &-close {
    transition: transform 200ms ease;
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
