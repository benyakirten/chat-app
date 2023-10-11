<script setup lang="ts">
const userStore = useUsersStore()
const profile = computed(() => userStore.users.get(userStore.me?.id ?? ''))
</script>

<template>
  <BasePage title="Account">
    <div v-if="!userStore.me || !profile" class="no-user">You must be logged in to view your account.</div>
    <AccountSettings v-else :me="userStore.me" :profile="profile" />
  </BasePage>
</template>

<style scoped>
.no-user {
  padding: 2rem;
  font-size: var(--text-xxl);
}
</style>
