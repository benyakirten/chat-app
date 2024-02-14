<script setup lang="ts">
const props = defineProps<{ magnification: number }>()
const userStore = useUsersStore()
const toastStore = useToastStore()

const convertOptionToText = (option: number) => `${option * 10}%`
const magnificationOptions = Array.from({ length: 8 }, (_, idx) => ({ id: convertOptionToText(7 + idx) }))
const magnificationSelected = ref(
  new Set([convertOptionToText(isNaN(props.magnification) ? 10 : props.magnification * 10)])
)
watch(magnificationSelected, (val) => {
  const _val = getFirstSetItem(val) ?? '100%'
  const size = parseInt(_val) / 100
  if (isNaN(size)) {
    toastStore.addErrorToast(`Input ${val} cannot be parsed`, 'Size value cannot be parsed')
  }

  userStore.setAccountOption('magnification', size)
})
</script>

<template>
  <BaseMultiselect
    :options="magnificationOptions"
    v-model="magnificationSelected"
    title="Text Magnification"
    placeholder="Set text magnification..."
    type="single"
    :search="(item, text) => item.id.includes(text)"
  >
    <template #label>
      <AccountInputsLabel>Text Magnification</AccountInputsLabel>
    </template>
    <template #item="{ item }">
      <AccountInputsItem>{{ item.id }}</AccountInputsItem>
    </template>
  </BaseMultiselect>
</template>
