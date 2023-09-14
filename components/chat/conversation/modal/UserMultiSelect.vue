<script setup lang="ts">
const props = withDefaults(defineProps<{ selected: Set<string>; options: User[]; canDelete?: boolean }>(), {
  canDelete: true,
})
const emit = defineEmits<{ (e: 'setSelected', val: Set<string>): void }>()

const handleSearch = (user: User, search: string) => user.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())

function handleDelete(value: string) {
  props.selected.delete(value)
  emit('setSelected', props.selected)
}
</script>

<template>
  <BaseMultiSelect
    :options="options"
    title="Participants"
    :model-value="selected"
    @update:modelValue="emit('setSelected', $event)"
    :search="handleSearch"
    placeholder="Choose the participants"
  >
    <template #no-options>
      <div class="no-options">No options available.</div>
    </template>
    <template #label>
      <ChatConversationModalNewCurrentUsers :can-delete="canDelete" :selected="selected" @delete="handleDelete" />
    </template>
    <template #item="{ item }">
      <ChatConversationModalNewUserItem :user="item" />
    </template>
  </BaseMultiSelect>
</template>

<style scoped>
.no-options {
  display: flex;
  align-items: center;
  padding-left: 0.5rem;

  cursor: default;

  font-size: var(--text-xl);

  &:hover {
    background-color: var(--bg-primary);
  }
}
</style>
