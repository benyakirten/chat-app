<script setup lang="ts">
const props = defineProps<{ me: Me; profile: User }>()
</script>

<template>
  <div class="user-settings">
    <AccountSection title="Change Settings">
      <AccountInputs v-bind="props" />
    </AccountSection>
    <ClientOnly>
      <!--
        TODO: Figure out why this is erroring 
        It seems to have to do with layout with grid/flexbox
      -->
      <AccountSection title="Statistics" />
      <AccountStatistics v-bind="props" />
    </ClientOnly>
  </div>
</template>

<style scoped>
.user-settings {
  height: 100%;
  overflow: auto;
  padding: 8rem;

  display: grid;
  row-gap: 4rem;
}
</style>
