<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    selected: Set<string>
    options: User[]
    isNewConversation?: boolean
    errorMessage?: string
    isValid?: boolean
  }>(),
  {
    isNewConversation: true,
  }
)

const userStore = useUsersStore()
const emit = defineEmits<{ (e: 'setSelected', val: Set<string>): void }>()

const handleSearch = (user: User, search: string) => user.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())

function handleDelete(value: string) {
  props.selected.delete(value)
  emit('setSelected', props.selected)
}

const placeholder = computed(() => (props.isNewConversation ? 'Choose the participants' : 'Choose new participants'))
</script>

<template>
  <BaseMultiselect
    :options="options"
    title="Participants"
    :model-value="selected"
    :search="handleSearch"
    :placeholder="placeholder"
    :is-valid="isValid"
    @update:modelValue="emit('setSelected', $event)"
    :can-load-more="userStore.token !== ''"
    :search-callback="userStore.performSearch"
  >
    <template #no-options>
      <div class="no-options">No options available.</div>
    </template>
    <template #label>
      <GeneralInputUserMultiCurrentUsers
        :is-new-conversation="isNewConversation"
        :selected="selected"
        @delete="handleDelete"
      />
    </template>
    <template #item="{ item }">
      <GeneralInputUserMultiUserItem :user="item" />
    </template>
    <template #error v-if="errorMessage">
      <p class="error">
        {{ errorMessage }}
      </p>
    </template>
  </BaseMultiselect>
</template>

<style scoped>
.no-options {
  display: flex;
  align-items: center;
  padding-left: 0.5rem;

  cursor: default;

  font-size: var(--text-size-xl);

  &:hover {
    background-color: var(--bg-primary);
  }
}

.error {
  padding-block: var(--size-sm);
  color: var(--error-bg);
}
</style>
