<script setup lang="ts">
const props = defineProps<{ name: string }>()
const userStore = useUsersStore()
const socketStore = useSocketStore()
const toastStore = useToastStore()

const userName = ref(props.name)
const isValid = ref(false)

function updateUserName() {
  try {
    socketStore.transmitDisplayNameChange(userName.value)
  } catch (e) {
    toastStore.addErrorToast(e, 'Unable to transmit display name update')
  }
}
</script>

<template>
  <GeneralInputText
    v-model="userName"
    style="max-width: 25rem"
    placeholder="Choose a username"
    minlength="3"
    maxlength="20"
    :pattern="`^(?!${userStore.userMe?.name}).*$`"
    required
    @set-valid="(e) => (isValid = e)"
  >
    <template #label><AccountInputsLabel>Display Name</AccountInputsLabel></template>
    <template #error> New usernames must be between 3 and 20 letters long. </template>
  </GeneralInputText>
  <BaseRoundedButton class="update-button" :disabled="!isValid" @click="updateUserName">
    Update user name
  </BaseRoundedButton>
</template>

<style scoped>
.update-button {
  align-self: end;

  @media (width <= 600px) {
    width: max-content;
  }
}
</style>
