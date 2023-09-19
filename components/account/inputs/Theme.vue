<script setup lang="ts">
const props = defineProps<{ theme: Me['colorTheme'] }>()
const userStore = useUsersStore()

const themeOptions = [{ id: 'night' }, { id: 'day' }, { id: 'auto' }]
const themeSelected = ref(new Set([capitalize(props.theme)]))
watch(themeSelected, (val) =>
  userStore.setAccountOption('colorTheme', (getFirstSetItem(val) as MutableOptions['colorTheme']) ?? 'night')
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
      <AccountInputsLabel>Text Magnification</AccountInputsLabel>
    </template>
    <template #item="{ item }">
      <AccountInputsLabel>{{ item.id }}</AccountInputsLabel>
    </template>
  </BaseMultiSelect>
</template>
