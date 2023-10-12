import { defineStore } from 'pinia'
import { Socket, Presence, type Channel } from 'phoenix'
import { ConversationId, UserId } from './messages'
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
      toastStore.add('Unable to initiate live connection.', { type: 'error' })
      return
    }

    if (socket) {
      console.log('the socket has already been initialized - returning early')
      return
    }

    const { token, hidden, id } = userStore.me

    socket = new Socket(config.public.wsUrl, { params: { token } })
    socket.connect()
    socket.onError((err) => addErrorToast(err))

    // TODO: Abstract this and handle errors better?
    systemChannel = socket.channel('system:general', { token, hidden })
    systemChannel.onError((reason) => addErrorToast(reason))
    systemChannel.join().receive('error', (reason) => addErrorToast(reason))

    userChannel = socket.channel(`user:${id}`, { token })
    userChannel.onError((reason) => addErrorToast(reason))
    userChannel.join().receive('error', (reason) => addErrorToast(reason))

    for (const conversation of messageStore.conversations) {
      joinConversation(conversation)
      break
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

  function joinConversation(conversation: Conversation) {
    const token = userStore.me?.token
    const conversationName = conversation.alias ?? conversation.id
    if (!socket) {
      addErrorToast(`Unable to join ${conversation}`, `Unable to join conversation ${conversationName}.`)
      return
    }

    const channel = socket.channel(`conversation:${conversation.id}`, { token })
    channel
      .join()
      .receive('ok', (data) => {
        const parsedData = CHANNEL_JOIN_SHAPE.safeParse(data)

        if (!parsedData.success) {
          // console.log(parsedData.error)
          addErrorToast(
            parsedData.error,
            `Unexpected data shape for conversation ${conversationName}. Details for this conversation may be missing`
          )
          return
        }

        for (const member of parsedData.data.users) {
          const readTime = parsedData.data.read_times[member.id]
          conversation.members.set(member.id, {
            state: 'idle',
            lastRead: new Date(readTime ?? 0),
          })
        }

        for (const message of parsedData.data.messages) {
          conversation.messages.set(message.id, {
            id: message.id,
            content: message.content,
            sender: message.sender,
            createTime: new Date(message.inserted_at),
            updateTime: new Date(message.updated_at),
            status: 'complete',
          })
        }
      })
      .receive('error', (error) => {
        addErrorToast(error, `Unable to join conversation ${conversationName}.`)
      })
  }

  function leaveConversation(conversationId: ConversationId) {
    //
  }

  function receiveConversationLeave(conversationId: ConversationId, user: UserId) {
    //
  }

  function transmitNameChanged(newName: string) {
    //
  }

  function receiveNameChanged(userId: UserId, newName: string) {
    //
  }

  function transmitConversationRead(conversationId: ConversationId) {
    //
  }

  function receiveConversationRead(conversationId: ConversationId, userId: UserId) {
    //
  }

  function addMessage(conversationId: ConversationId, message: ConversationMessage) {
    //
  }

  function receiveMessage(conversationId: ConversationId, message: ConversationMessage) {
    //
  }

  function transmitConversationAliasChanged(conversationId: ConversationId, alias: string) {
    //
  }

  function receiveConversationAliasChanged(conversationId: ConversationId, alias: string) {
    //
  }

  // function

  function disconnect() {
    socket?.disconnect()
    socket = null
    userChannel = null
    systemChannel = null
    conversationChannels = new Map()
  }

  return {
    socket,
    systemChannel,
    userChannel,
    conversationChannels,
    init,
    disconnect,
    joinConversation,
    leaveConversation,
    receiveConversationLeave,
    transmitNameChanged,
    receiveNameChanged,
    transmitConversationRead,
    receiveConversationRead,
    addMessage,
    receiveMessage,
    transmitConversationAliasChanged,
    receiveConversationAliasChanged,
  }
})
