<script setup lang="ts">
const userStore = useUsersStore()
const profile = computed(() => userStore.users.get(userStore.me?.id ?? ''))
</script>

<template>
  <BasePage title="Account">
    <FallbackClient>
      <div v-if="!userStore.me || !profile" class="no-user">You must be logged in to view your account.</div>
      <AccountSettings v-else :me="userStore.me" :profile="profile" />
    </FallbackClient>
  </BasePage>
</template>

<style scoped>
.no-user {
  padding: 2rem;
  font-size: var(--text-size-xxl);
}
</style>
