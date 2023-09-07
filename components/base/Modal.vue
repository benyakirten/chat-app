<script setup lang="ts">
import { FocusTrap } from 'focus-trap-vue'
import { XMarkIcon } from '@heroicons/vue/24/solid'

const { open, initialFocusCallback } = defineProps<{ open: boolean; initialFocusCallback?: () => HTMLElement }>()
defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits<{ (e: 'close'): void }>()

const dialog = ref<HTMLDialogElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

watchEffect(() => {
  open ? dialog.value?.showModal() : dialog.value?.close()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="open" class="backdrop" @click="emit('close')"></div>
    </Transition>
    <FocusTrap :active="open" :initial-focus="initialFocusCallback ?? button ?? false">
      <dialog ref="dialog" class="dialog" @keydown="handleKeydown" :open="open" v-bind="$attrs">
        <button class="dialog-close" ref="button" aria-label="Close Modal" @click="emit('close')">
          <XMarkIcon />
        </button>
        <slot></slot>
      </dialog>
    </FocusTrap>
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
    background-color: salmon;
    /* Why is this not showing up? */
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

  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  height: 100vh;
  width: 100vw;
  z-index: 99;
}
</style>
