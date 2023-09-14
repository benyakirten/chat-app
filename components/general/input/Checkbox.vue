<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

function handleUpdate(e: Event) {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }

  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label class="checkbox">
    <slot></slot>
    <input type="checkbox" class="checkbox-input" :checked="modelValue" @input="handleUpdate" />
  </label>
</template>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 1rem;

  position: relative;
  cursor: pointer;

  &-input {
    appearance: none;
    position: relative;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--highlight);
    border-radius: 2px;

    &::after,
    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      content: '';
      width: 1.2rem;
      height: 1.6rem;
      box-shadow: inset 1rem 1rem var(--opposite);
    }

    &::before {
      transition: clip-path 300ms ease;
      clip-path: polygon(0% 65.01%, 0% 65%, 50% 100%, 50% 100%);
    }

    &::after {
      transition: clip-path 300ms ease-out 300ms;
      clip-path: polygon(55.91% 90.06%, 55.91% 90.06%, 45.96% 83.15%, 45.96% 83.15%);
    }

    &:checked::before {
      clip-path: polygon(6.12% 56.26%, 0% 65%, 50% 100%, 56.12% 91.26%);
    }

    &:checked::after {
      clip-path: polygon(55.91% 90.06%, 100% 16%, 90.05% 10.07%, 45.96% 84.14%);
    }
  }
}
</style>
