<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<!-- TODO: Make my own page transitions -->
<style>
.page-enter-active,
.page-leave-active {
  transition: all var(--time-400);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
