<script setup lang="ts">
const props = defineProps<{ name: string }>()
const userStore = useUsersStore()

const userName = ref(props.name)
const { debouncer } = useDebounce((val: string) => !!val && userStore.setUserName(val), 1200)
watch(userName, (val) => val && debouncer(val))
</script>

<template>
  <GeneralInputText v-model="userName" style="max-width: 25rem" placeholder="Choose a username">
    <template #label><AccountInputsLabel>Display Name</AccountInputsLabel></template>
  </GeneralInputText>
</template>
