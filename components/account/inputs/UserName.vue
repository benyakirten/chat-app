<script setup lang="ts">
const props = defineProps<{ name: string }>()
const userStore = useUsersStore()
const socketStore = useSocketStore()
const toastStore = useToastStore()

const userName = ref(props.name)
function updateUserName() {
  try {
    socketStore.transmitDisplayNameChange(userName.value)
  } catch (e) {
    toastStore.addErrorToast(e, 'Unable to transmit display name update')
  }
}
</script>

<template>
  <GeneralInputText v-model="userName" style="max-width: 25rem" placeholder="Choose a username">
    <template #label><AccountInputsLabel>Display Name</AccountInputsLabel></template>
  </GeneralInputText>
  <BaseButton :disabled="userName === userStore.userMe?.name" @click="updateUserName"> Update user name </BaseButton>
</template>
