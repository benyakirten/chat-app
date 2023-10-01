<script setup lang="ts">
definePageMeta({
  pageTransition: false,
})

import { Socket, Presence } from 'phoenix'
onMounted(() => {
  // let socket = new Socket('ws://localhost:4000/socket', {
  //   params: {
  //   },
  // })
  // socket.connect()
  // socket.onError((err) => console.log(err))
  // let channel = socket.channel('system:general', { hidden: Math.random() > 0.5 })
  // let presence = new Presence(channel)
  // presence.onSync(() => {
  //   presence.list((id, stuff) => {
  //     console.log('HERE')
  //     console.log(id)
  //     console.log(stuff)
  //   })
  // })
  // channel.join()
  // channel.on('new_msg', (msg) => console.log(msg))
})
</script>

<template>
  <ChatLayout><p class="no-conversation">Select a conversation to see messages.</p> </ChatLayout>
</template>

<style scoped>
.no-conversation {
  padding: 1rem;
}
</style>
