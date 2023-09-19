<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue: boolean; disabled?: boolean }>(), {
  disabled: false,
})
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

function handleUpdate(e: Event) {
  if (!(e.target instanceof HTMLInputElement) || props.disabled) {
    return
  }

  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label class="checkbox" :class="{ disabled }">
    <span class="checkbox-label">
      <slot></slot>
    </span>
    <input type="checkbox" class="checkbox-input" :checked="modelValue" @input="handleUpdate" :disabled="disabled" />
  </label>
</template>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 1rem;

  position: relative;
  cursor: pointer;

  &.vertical {
    flex-direction: column;
  }

  &.disabled {
    cursor: default;
  }

  &-label {
    margin: 2px 0;
  }

  &-input {
    --checkmark-color: var(--opposite);

    appearance: none;

    position: relative;
    cursor: pointer;

    width: 2rem;
    height: 2rem;
    border: 1px solid var(--highlight);
    border-radius: 2px;

    &[disabled] {
      cursor: default;
      --checkmark-color: var(--text);
      background-color: var(--neutral);
    }

    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      content: '';
      width: 1.2rem;
      height: 1.8rem;
      box-shadow: inset 1rem 1rem var(--checkmark-color);

      clip-path: polygon(0% 65.01%, 0% 65%, 50% 100%, 50% 100%);
    }

    &:checked::before {
      animation: grow-checkmark 300ms ease-out forwards;
    }
  }
}

@keyframes grow-checkmark {
  0% {
    clip-path: polygon(0% 65.01%, 0% 65%, 50% 100%, 50% 100%);
  }

  25% {
    clip-path: polygon(6.12% 56.26%, 0% 65%, 25.76% 83.04%, 31.88% 74.3%);
  }

  35% {
    clip-path: polygon(6.12% 56.26%, 0% 65%, 50% 100%, 56.12% 91.26%);
  }

  50% {
    clip-path: polygon(6.12% 56.26%, 0% 65%, 50% 100%, 56.12% 91.26%, 80.63% 56.26%, 68.04% 47.45%, 43.53% 82.45%);
  }

  100% {
    clip-path: polygon(6.12% 56.26%, 0% 65%, 50% 100%, 56.12% 91.26%, 97.51% 32.15%, 84.92% 23.34%, 43.53% 82.45%);
  }
}
</style>
