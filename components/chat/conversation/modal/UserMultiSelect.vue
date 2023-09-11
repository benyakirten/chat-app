<script setup lang="ts">
const props = defineProps<{ selected: Set<string> }>()
const emit = defineEmits<{ (e: 'setSelected', val: Set<string>): void }>()

const userStore = useUsersStore()
const handleSearch = (user: User, search: string) => user.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())

function handleDelete(value: string) {
  props.selected.delete(value)
  emit('setSelected', props.selected)
}
</script>

<template>
  <BaseMultiSelect
    :options="[...userStore.users.values()].filter((user) => user.id !== userStore.me)"
    title="Participants"
    :model-value="selected"
    @update:modelValue="emit('setSelected', $event)"
    :search="handleSearch"
    placeholder="Choose the participants"
  >
    <template #label>
      <ChatConversationModalNewCurrentUsers :selected="selected" @delete="handleDelete" />
    </template>
    <template #item="{ item }">
      <ChatConversationModalNewUserItem :user="item" />
    </template>
  </BaseMultiSelect>
</template>
