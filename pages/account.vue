<script setup lang="ts">
import { useUsersStore } from '@/stores/users'

const userStore = useUsersStore()
const selected = ref<Set<string>>(new Set(['u1']))
</script>

<template>
  <div class="account">
    <h1>ACCOUNT PAGE</h1>
    <BaseMultiSelect title="Users" :options="userStore.users" :selected="selected">
      <template #item="{ item }">
        <div class="account-item">
          {{ item.name }}
        </div>
      </template>
    </BaseMultiSelect>
  </div>
</template>

<style scoped>
.account {
  padding: 4rem;
  width: 100%;
  height: 100%;
}
</style>
