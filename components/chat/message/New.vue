<script setup lang="ts">
const text = ref("")
const itemHeight = ref("0px")
const textArea = ref<HTMLTextAreaElement | null>(null)
const hiddenDiv = ref<HTMLDivElement | null>(null)

watch(text, () => {
  requestAnimationFrame(() => {
    if (!hiddenDiv.value) {
      return
    }
    console.log(hiddenDiv.value.scrollHeight)
    itemHeight.value = `${hiddenDiv.value.scrollHeight + 4}px`
  })
})

function handleKeydown(e: KeyboardEvent) {
  //
}
</script>

<template>
  <div class="new-message">
    <div ref="hiddenDiv" class="new-message-hidden">{{ text }}</div>
    <textarea ref="textArea" v-model="text" class="new-message-input" placeholder="Write your message here..."
      @keydown="handleKeydown"></textarea>
  </div>
</template>

<style scoped>
.new-message {
  place-self: end;
  width: 100%;

  display: grid;
  position: relative;
  padding: 0.5rem 1rem 0;
  place-content: center;
  justify-content: stretch;

  &-input,
  &-hidden {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    resize: none;
    font-size: 1.2rem;

    /* TODO: Figure out why this has to be specified */
    font-family: "Roboto";
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
