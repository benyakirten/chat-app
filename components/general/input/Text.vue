<script setup lang="ts">
import { v4 as uuid } from 'uuid'

withDefaults(defineProps<{ modelValue: string; placeholder: string; id?: string }>(), {
  id: uuid(),
})
defineOptions({ inheritAttrs: false })
const textRef = ref<HTMLInputElement>()
const isValid = ref(true)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function handleInput(e: Event) {
  isValid.value = !!textRef.value?.checkValidity()
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
        ref="textRef"
      />
      <div class="text-input-container-icon">
        <slot name="icon"></slot>
      </div>
    </div>
    <div class="text-input-error" :style="{ display: isValid ? 'none' : 'block' }" v-if="$slots['error']">
      <slot name="error"></slot>
    </div>
  </div>
</template>

<style scoped>
.text-input {
  display: flex;
  flex-direction: column;
  gap: var(--size-sm);

  &-error {
    color: var(--error-bg);
  }

  &-label {
    font-size: var(--text-size-xl);
  }

  &-container {
    --padding-x-input: var(--size-xl);
    --icon: calc(2 * var(--size-md));

    position: relative;
    display: flex;
    align-items: center;

    &-input {
      height: calc(var(--icon) + var(--size-xl));
      width: 100%;

      padding: var(--size-xl) var(--padding-x-input);
      padding-right: var(--icon);
      border-radius: 9999px;
      border: none;

      /* TODO: This is a mess */
      &:disabled {
        background-color: var(--neutral);
        color: var(--text-color);
      }

      &:user-invalid {
        outline: 2px solid var(--error-bg);
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
