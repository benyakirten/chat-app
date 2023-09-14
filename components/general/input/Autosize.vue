<script setup lang="ts">
const props = withDefaults(
  defineProps<{ modelValue: string; placeholder: string; label: string; autofocus?: boolean }>(),
  { autofocus: false }
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
  if (!(e.target instanceof HTMLTextAreaElement)) {
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
  <div class="autosize">
    <div ref="hiddenDiv" aria-hidden="true" class="autosize-hidden">{{ props.modelValue }}</div>
    <textarea
      ref="textarea"
      :aria-label="label"
      @input="handleUpdateValue"
      :value="props.modelValue"
      class="autosize-input"
      :placeholder="placeholder"
    >
    </textarea>
  </div>
</template>

<style scoped>
.autosize {
  place-self: end;
  width: 100%;

  display: grid;
  position: relative;
  padding: 0.5rem 1rem 0;
  place-content: center;
  justify-content: stretch;

  /* TODO: Make CSS less horrid */

  &-input,
  &-hidden {
    word-break: break-all;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    resize: none;

    font-family: 'Roboto';
    height: clamp(3.2rem, v-bind(itemHeight), 12.8rem);
  }

  &-hidden {
    position: absolute;
    height: min-content;
    margin: 0 var(--text-lg);
    z-index: -100;
    visibility: hidden;
    pointer-events: none;
    white-space: pre-wrap;
  }
}
</style>
