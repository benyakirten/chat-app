<script setup lang="ts">
const text = ref("")
const itemHeight = ref("0px")
const textArea = ref<HTMLTextAreaElement | null>(null)
function handleKeypress(e: KeyboardEvent) {
  const area = e.target as HTMLTextAreaElement
  requestAnimationFrame(() => {
    if (!(e.target instanceof HTMLTextAreaElement)) {
      return
    }
    itemHeight.value = `${e.target.scrollHeight + 4}px`
  })
}
</script>

<template>
  <div class="new-message">
    <textarea ref="textArea" v-model="text" class="new-message-input" placeholder="Write your message here..."
      @keydown="handleKeypress"></textarea>
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

    font-family: "Roboto";
    height: clamp(3rem, v-bind(itemHeight), calc(16rem));
  }
}
</style>
