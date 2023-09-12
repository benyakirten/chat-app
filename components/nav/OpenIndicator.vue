<script lang="ts" setup>
const { open } = defineProps<{ open: boolean }>()
</script>

<template>
  <div class="indicator" aria-hidden="true">
    <Transition name="arrow" mode="out-in">
      <div class="indicator-top" v-if="open"></div>
      <div class="indicator-bottom" v-else></div>
    </Transition>
  </div>
</template>

<style scoped>
.indicator {
  /* TODO: Make arrow look better */
  position: relative;
  width: 0.15rem;
  height: 0.7rem;
  background-color: var(--primary-text);

  div {
    background-color: var(--primary-text);
    width: 0.45rem;
    height: 0.9rem;
    translate: -30% -20%;
    clip-path: polygon(0% 80%, 50% 100%, 100% 80%);
  }

  &-top {
    rotate: 180deg;
  }

  .arrow-enter-active,
  .arrow-leave-active {
    transition: scale 50ms ease-in;
    scale: 1;
  }

  .arrow-enter-from,
  .arrow-leave-to {
    scale: 0;
  }
}
</style>
