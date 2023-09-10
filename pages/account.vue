<script setup lang="ts">
import type { User } from '@/stores/users'

const userStore = useUsersStore()
const selected = ref<Set<string>>(new Set(['u1']))

function isUserVisible(user: User, search: string) {
  return user.name.toLowerCase().includes(search.toLowerCase())
}

const newPersons = ref(0)
async function searchCallback(val: string) {
  await waitFor(2000)
  const id = Math.random().toString()
  const user: User = {
    id,
    name: `New Person${++newPersons.value} - ${val}`,
    state: 'completed',
  }
  userStore.users.set(id, user)
}
</script>

<template>
  <div class="account">
    <h1>ACCOUNT PAGE</h1>
    <BaseMultiSelect
      placeholder="Choose who to talk to"
      title="Users"
      :options="[...userStore.users.values()]"
      :has-focus="() => Math.random() > 0.5"
      :search="isUserVisible"
      :search-callback="searchCallback"
      v-model="selected"
    >
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
