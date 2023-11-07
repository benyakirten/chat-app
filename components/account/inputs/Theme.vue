<script setup lang="ts">
const props = defineProps<{ theme: Me['theme'] }>()
const userStore = useUsersStore()

const themeOptions = [{ id: 'night' }, { id: 'day' }, { id: 'auto' }]
const themeSelected = ref(new Set([capitalize(props.theme)]))
watch(themeSelected, (val) =>
  userStore.setAccountOption('theme', (getFirstSetItem(val) as MutableOptions['theme']) ?? 'night')
)
</script>

<template>
  <BaseMultiSelect
    :options="themeOptions"
    v-model="themeSelected"
    title="Color Theme"
    placeholder="Set color theme..."
    type="single"
    :search="(item, text) => item.id.includes(text)"
    :get-text="(item) => capitalize(item.id)"
  >
    <template #label>
      <AccountInputsLabel>Color theme</AccountInputsLabel>
    </template>
    <template #item="{ item }">
      <AccountInputsItem>{{ item.id }}</AccountInputsItem>
    </template>
  </BaseMultiSelect>
</template>
