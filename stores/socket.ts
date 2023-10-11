import { defineStore } from 'pinia'
import { Socket, Presence, type Channel } from 'phoenix'
import { ConversationId } from './messages'

export const useSocketStore = defineStore('socket', () => {
  const config = useRuntimeConfig()
  const messageStore = useMessageStore()

  let socket: Socket | null = null
  let systemChannel: Channel | null = null
  let userChannel: Channel | null = null
  let conversationChannels: Map<ConversationId, Channel> = new Map()

  function init() {
    //
  }

  function joinConversation(conversationId: ConversationId) {
    //
  }

  function leaveConversation(conversationId: ConversationId) {
    //
  }

  function disconnect() {
    socket?.disconnect()
    socket = null
  }
  // onMounted(() => {
  //   const token =
  //     'SFMyNTY.g2gDbQAAACQ1ZGJlYTNkOS0zYjE5LTQzOGEtYmM3NC0wMDFmNjRmZWRjMTduBgCzxm8KiwFiAAAHCA._TfHS2WPDoGSG-jHcZ04WbL7KhBfUACQE8iknLY2LJs'
  //   let socket = new Socket('ws://localhost:4000/socket', { params: { token } })
  //   socket.connect()
  //   let channel = socket.channel('system:general', { token, hidden: false })
  //   channel.join()
  //   let channel2 = socket.channel('user:5dbea3d9-3b19-438a-bc74-001f64fedc17', { token })
  //   channel2.join()
  //   let channel3 = socket.channel('conversation:3216ba47-1ce0-4736-9ef4-d5e1734fc8dd', { token })
  //   channel3
  //     .join()
  //     .receive('ok', (msg) => {
  //       console.log('CONVERSATION OK')
  //       console.log(msg)
  //     })
  //     .receive('error', (msg) => {
  //       console.log('CONVERSATION ERROR')
  //       console.log(msg)
  //     })
  // })

  return {
    socket,
    systemChannel,
    userChannel,
    conversationChannels,
    init,
    disconnect,
    joinConversation,
    leaveConversation,
  }
})
