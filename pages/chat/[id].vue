<script lang="ts" setup>
definePageMeta({
  pageTransition: false,
})

const route = useRoute()
const socketStore = useSocketStore()
// TODO: Work on types here
const id = toRef(route.params['id'] as string)
const visibilityState = ref(true)

watch([() => id.value, () => visibilityState.value], ([$id, $visiblityState]) => {
  if ($id && $visiblityState) {
    socketStore.transmitConversationRead($id)
  }
})

function handleVisibilityChange() {
  visibilityState.value = document.visibilityState === 'visible'
}

useAddMountedEventCallback('visibilitychange', handleVisibilityChange)
</script>

<template>
  <ChatLayout :id="id" />
</template>
