<script setup lang="ts">
const props = defineProps<{ me: Me; profile: User }>()
</script>

<template>
  <div class="user">
    <AccountSection title="Change Settings">
      <AccountInputs v-bind="props" />
    </AccountSection>
    <!-- TODO: Get this to work without the occasional error -->
    <!-- <ClientOnly>
      <AccountSection title="Statistics">
        <AccountStatistics v-bind="props" />
      </AccountSection>
    </ClientOnly> -->
  </div>
</template>

<style scoped>
.user {
  height: 100%;
  overflow: auto;
  padding: 8rem;

  display: grid;
  row-gap: 4rem;
}
</style>
