<script setup lang="ts">
import { v4 as uuid } from 'uuid'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder: string
    label: string
    disabled?: boolean
    autofocus?: boolean
    id?: string
    required?: boolean
  }>(),
  { autofocus: false, id: uuid(), required: false, disabled: false }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const itemHeight = ref('0px')
const textarea = ref<HTMLTextAreaElement | null>(null)
const hiddenDiv = ref<HTMLDivElement | null>(null)

watch(
  () => props.modelValue,
  async () => {
    await nextTick()
    if (!hiddenDiv.value) {
      return
    }
    itemHeight.value = `${hiddenDiv.value.scrollHeight + 4}px`
  }
)

function handleUpdateValue(e: Event) {
  if (!(e.target instanceof HTMLTextAreaElement) || props.disabled) {
    return
  }

  emit('update:modelValue', e.target.value)
}

onMounted(() => {
  if (props.autofocus) {
    textarea.value?.focus()
  }
})
</script>

<template>
  <div class="autosize-container">
    <div class="autosize">
      <div ref="hiddenDiv" aria-hidden="true" class="autosize-hidden">{{ modelValue }}</div>
      <textarea
        ref="textarea"
        :id="id"
        :aria-label="label"
        @input="handleUpdateValue"
        :value="modelValue"
        class="autosize-input"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
      >
      </textarea>
    </div>
    <output
      class="autosize-container-error"
      :for="id"
      aria-live="polite"
      :style="{ display: required && !modelValue ? 'block' : 'none' }"
      v-if="$slots['error']"
    >
      <slot name="error"></slot>
    </output>
  </div>
</template>

<style scoped>
.autosize-container {
  display: flex;
  flex-direction: column;
  gap: var(--size-sm);

  &-error {
    color: var(--error-bg);
  }
}

.autosize {
  width: 100%;

  display: grid;
  position: relative;
  place-content: center;
  justify-content: stretch;

  &:invalid {
    outline: 2px solid var(--error-bg);
  }

  &-input:disabled {
    background-color: var(--disabled-bg);
    color: var(--disabled-text);
  }

  &-input,
  &-hidden {
    word-break: break-all;
    padding: var(--size-xs);
    border-radius: 4px;
    resize: none;

    font-family: 'Roboto';
    font-size: var(--text-size-xl);
    height: clamp(3.2rem, v-bind(itemHeight), 12.8rem);
  }

  &-hidden {
    position: absolute;
    height: min-content;
    z-index: -100;
    visibility: hidden;
    pointer-events: none;
    white-space: pre-wrap;
    margin-left: 2px;
  }
}
</style>
