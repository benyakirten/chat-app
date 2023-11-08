<script setup lang="ts">
import { v4 as uuid } from 'uuid'

withDefaults(defineProps<{ modelValue: string; placeholder: string; id?: string }>(), { id: uuid() })
defineOptions({ inheritAttrs: false })

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function handleInput(e: Event) {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div class="text-input">
    <label class="text-input-label" :for="id">
      <slot name="label"></slot>
    </label>
    <div class="text-input-container">
      <input
        :id="id"
        class="text-input-container-input"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
        v-bind="$attrs"
      />
      <div class="text-input-container-icon">
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-input {
  display: flex;
  flex-direction: column;
  gap: var(--size-sm);

  &-label {
    font-size: var(--text-size-xl);
  }

  &-container {
    --padding-x-input: var(--size-md);
    --icon: calc(2 * var(--size-md));

    position: relative;
    display: flex;
    align-items: center;

    &-input {
      height: calc(var(--icon) + calc(0.5 * var(--size-md)));
      width: 100%;

      padding: calc(0.5 * var(--size-md)) var(--padding-x-input);
      padding-right: var(--icon);
      border-radius: 4px;
      border: none;

      /* TODO: This is a mess */
      &:disabled {
        background-color: var(--neutral);
        color: var(--text-color);
      }
    }

    &-icon {
      position: absolute;
      top: 50%;
      right: var(--padding-x-input);
      height: var(--icon);
      width: var(--icon);
      transform: translateY(-50%);
      color: var(--text-color);
    }
  }
}
</style>
