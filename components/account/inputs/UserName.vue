<script setup lang="ts">
const props = defineProps<{ name: string }>()
const userStore = useUsersStore()

const userName = ref(props.name)
const { debouncer } = useDebounce((val: string) => userStore.setMyOptions('name', val), 1200)
watch(userName, (val) => val && debouncer(val))
</script>

<template>
  <GeneralInputText v-model="userName" placeholder="Choose a username">
    <template #label><div class="label">Display Name</div> </template>
  </GeneralInputText>
</template>
