<script setup lang="ts">
const props = defineProps<{ me: Me; profile: User }>()
</script>

<template>
  <div class="user">
    <h2>Change Settings</h2>
    <div class="user-settings">
      <AccountInputs v-bind="props" />
    </div>
    <h2>Statistics</h2>
    <div class="user-statistics">
      <AccountStatistics v-bind="props" />
    </div>
  </div>
</template>

<style scoped>
.user {
  height: 100%;
  padding: 8rem;

  h2 {
    text-decoration: underline;
    padding-bottom: 2px;
    margin-bottom: 2rem;
  }

  &-settings {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 4rem;
  }

  &-statistics {
    /*  */
  }
}
</style>
