<script lang="ts" setup>
const modalStore = useModalStore()

function focusCombobox() {
  const combobox = document.querySelector("input[role='combobox']")
  if (combobox instanceof HTMLInputElement) {
    combobox.focus()
  }
}
</script>

<template>
  <BaseModal :open="modalStore.state?.type === 'about'" :initial-focus-callback="focusCombobox">
    <AboutContent />
  </BaseModal>
</template>
