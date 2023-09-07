<script setup lang="ts">
const { value, placeholder, label, autofocus } = withDefaults(
  defineProps<{ value?: string; placeholder: string; label: string; autofocus?: boolean }>(),
  { value: '', autofocus: false }
)

const emits = defineEmits<{
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'submit', value: string): void
  (e: 'cancel'): void
  (e: 'input', event: Event, value: string): void
}>()

const text = ref(value)
const itemHeight = ref('0px')
const textarea = ref<HTMLTextAreaElement | null>(null)
const hiddenDiv = ref<HTMLDivElement | null>(null)

watch(text, () => {
  requestAnimationFrame(() => {
    if (!hiddenDiv.value) {
      return
    }
    itemHeight.value = `${hiddenDiv.value.scrollHeight + 4}px`
  })
})

function handleKeydown(e: KeyboardEvent) {
  emits('keydown', e)

  if (e.key === 'Escape') {
    textarea.value?.blur()
    emits('cancel')
    return
  }

  if (e.key === 'Enter' && !e.shiftKey && text.value !== '') {
    emits('submit', text.value)
    requestAnimationFrame(() => (text.value = ''))
    return
  }
}

onMounted(() => {
  if (autofocus) {
    textarea.value?.focus()
  }
})
</script>

<template>
  <div class="autosize">
    <div ref="hiddenDiv" class="autosize-hidden">{{ text }}</div>
    <textarea
      ref="textarea"
      :aria-label="label"
      @keydown="handleKeydown"
      @input="emits('input', $event, text)"
      v-model="text"
      class="autosize-input"
      :placeholder="placeholder"
    ></textarea>
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
    padding: 0.5rem 1rem;
    border-radius: 4px;
    resize: none;
    font-size: 1.2rem;

    /* TODO: Figure out why this has to be specified */
    font-family: 'Roboto';
    height: clamp(3.2rem, v-bind(itemHeight), 12.8rem);
  }

  &-hidden {
    position: absolute;
    word-break: break-all;
    height: min-content;
    z-index: -100;
    pointer-events: none;
  }
}
</style>
