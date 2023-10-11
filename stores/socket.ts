import { defineStore } from 'pinia'
import { Socket, Presence, type Channel } from 'phoenix'
import { ConversationId } from './messages'
import { CHANNEL_JOIN_SHAPE } from '~/utils/shapes'

export const useSocketStore = defineStore('socket', () => {
  const config = useRuntimeConfig()
  const messageStore = useMessageStore()
  const toastStore = useToastStore()
  const userStore = useUsersStore()

  let socket: Socket | null = null
  let systemChannel: Channel | null = null
  let userChannel: Channel | null = null
  let conversationChannels: Map<ConversationId, Channel> = new Map()

  function init() {
    if (!userStore.me) {
      toastStore.add('Unable to initiate live connection with backend.', { type: 'error' })
      return
    }
    const { token, hidden, id } = userStore.me

    socket = new Socket(config.public.wsUrl)
    socket.onError((err) => addErrorToast(err))

    // TODO: Abstract this and handle errors better?
    systemChannel = socket.channel('system:general', { token, hidden })
    systemChannel.onError((reason) => addErrorToast(reason))
    systemChannel.join().receive('error', (reason) => addErrorToast(reason))

    userChannel = socket.channel(`system:${id}`, { token })
    userChannel.onError((reason) => addErrorToast(reason))
    userChannel.join().receive('error', (reason) => addErrorToast(reason))

    for (const conversation of messageStore.conversations) {
      joinConversation(conversation)
    }
  }

  function addErrorToast(
    err: any,
    msg: string = 'Unable to connect to system channel. Please attempt to reload the page or log out then back in'
  ) {
    toastStore.add(msg, {
      type: 'error',
      timeout: null,
    })

    if (err) {
      console.error(err)
    }
  }

  function changeMyName(newName: string) {
    //
  }

  function joinConversation(conversation: Conversation) {
    const conversationName = conversation.alias ?? conversation.id
    if (!socket) {
      addErrorToast(`Unable to join ${conversation}`, `Unable to join conversation ${conversationName}.`)
      return
    }

    const channel = socket.channel(`conversation:${conversation}`)
    channel
      .join()
      .receive('ok', (data) => {
        const parsedData = CHANNEL_JOIN_SHAPE.safeParse(data)
        conversationChannels.set(conversation.id, channel)
        if (!parsedData.success) {
          addErrorToast(
            parsedData.error,
            `Unexpected data shape for conversation ${conversationName}. Details for this conversation may be missing`
          )
        }
      })
      .receive('error', (error) => {
        addErrorToast(error, `Unable to join conversation ${conversationName}.`)
      })
  }

  function leaveConversation(conversationId: ConversationId) {
    //
  }

  function disconnect() {
    socket?.disconnect()
    socket = null
    userChannel = null
    systemChannel = null
    conversationChannels = new Map()
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
