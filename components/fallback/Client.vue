<template>
  <ClientOnly>
    <template #fallback>
      <div class="fallback">
        <div class="fallback-container">
          <span>Loading content...</span>
          <GeneralLoading size="4rem" />
        </div>
      </div>
    </template>
    <slot></slot>
  </ClientOnly>
</template>

<style scoped>
.fallback {
  margin-top: 20rem;
  display: grid;
  place-items: center;

  &-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
