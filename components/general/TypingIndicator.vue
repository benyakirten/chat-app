<script setup lang="ts">
withDefaults(defineProps<{ size?: string }>(), { size: '1rem' })
</script>

<template>
  <div class="typing">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style scoped>
.typing {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: calc(v-bind(size) * 3 / 4);
  padding: 1rem 1.5rem;

  background-color: var(--bg-primary);
  box-shadow: var(--item-box-shadow);
  background-image: var(--item-bg);
  border-radius: 1rem;

  --anim-speed: 1250ms;

  div {
    height: v-bind(size);
    width: v-bind(size);

    border-radius: var(--rounded);
    background-color: var(--text-color);

    animation: expand calc(var(--anim-speed)) linear infinite;

    &:nth-child(2) {
      animation-delay: calc(var(--anim-speed) / 4);
    }

    &:nth-child(3) {
      animation-delay: calc(var(--anim-speed) / 2);
    }
  }
}

@keyframes expand {
  0%,
  100% {
    scale: 1;
    opacity: 0.5;
  }

  33%,
  66% {
    scale: 1.07;
    opacity: 0.7;
  }

  50% {
    scale: 1.15;
    opacity: 0.9;
  }
}
</style>
