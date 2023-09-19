<script setup lang="ts">
const props = withDefaults(defineProps<{ selected: Set<string>; options: User[]; isNewConversation?: boolean }>(), {
  isNewConversation: true,
})
const emit = defineEmits<{ (e: 'setSelected', val: Set<string>): void }>()

const handleSearch = (user: User, search: string) => user.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())

function handleDelete(value: string) {
  props.selected.delete(value)
  emit('setSelected', props.selected)
}

const placeholder = computed(() => (props.isNewConversation ? 'Choose the participants' : 'Choose new participants'))
</script>

<template>
  <BaseMultiSelect
    :options="options"
    title="Participants"
    :model-value="selected"
    :search="handleSearch"
    :placeholder="placeholder"
    @update:modelValue="emit('setSelected', $event)"
  >
    <template #no-options>
      <div class="no-options">No options available.</div>
    </template>
    <template #label>
      <ChatConversationModalNewCurrentUsers
        :is-new-conversation="isNewConversation"
        :selected="selected"
        @delete="handleDelete"
      />
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
