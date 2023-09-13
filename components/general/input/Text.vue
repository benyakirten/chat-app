<script setup lang="ts">
defineProps<{ modelValue: string; placeholder: string }>()
defineOptions({
  inheritAttrs: false,
})
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function handleInput(e: Event) {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <label class="text">
    <slot name="label"></slot>
    <input class="text-input" :placeholder="placeholder" @input="handleInput" v-bind="$attrs" />
    <div class="text-icon">
      <slot name="icon"></slot>
    </div>
  </label>
</template>

<style scoped>
.text {
  --padding-x-container: 2rem;
  --padding-x-input: 1rem;
  --icon: 2rem;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem var(--padding-x-container);

  &-input {
    height: calc(var(--icon) + 0.5rem);
    width: 100%;

    padding: 0.5rem var(--padding-x-input);
    padding-right: var(--icon);
    border-radius: 4px;
    border: none;

    /* TODO: This is a mess */
    &:disabled {
      background-color: var(--neutral);
      color: var(--text);
    }
  }

  &-icon {
    position: absolute;
    top: 50%;
    right: calc(var(--padding-x-container) + var(--padding-x-input));
    height: var(--icon);
    width: var(--icon);
    transform: translateY(-50%);
    color: var(--text);
  }
}
</style>
