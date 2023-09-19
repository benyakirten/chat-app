<script setup lang="ts">
const props = defineProps<{ me: Me; profile: User }>()
</script>

<template>
  <div class="user">
    <AccountSection title="Change Settings">
      <AccountInputs v-bind="props" />
    </AccountSection>
    <AccountSection title="Statistics">
      <AccountStatistics v-bind="props" />
    </AccountSection>
  </div>
</template>

<style scoped>
.user {
  height: 100%;
  padding: 8rem;

  display: grid;
  row-gap: 4rem;
}
</style>
