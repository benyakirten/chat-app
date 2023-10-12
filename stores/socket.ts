import { defineStore } from 'pinia'
import { Socket, Presence, type Channel } from 'phoenix'
import { z } from 'zod'

import { ConversationId, ConversationMessage, UserId } from './messages'
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
    conversationChannels.set(conversation.id, channel)
    setupChannelJoinHandlers(channel, conversation, conversationName)
  }

  function setupChannelJoinHandlers(channel: Channel, conversation: Conversation, conversationName: string) {
    // Break this up into smaller functions
    channel
      .join()
      .receive('ok', (data) => {
        const parsedData = CHANNEL_JOIN_SHAPE.safeParse(data)

        if (!parsedData.success) {
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

    channel.on('new_message', (msg) => receiveNewMessage(conversation.id, msg.message))
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

  async function transmitNewMessage(conversationId: ConversationId, content: string): Promise<z.infer<typeof message>> {
    const channel = conversationChannels.get(conversationId)
    const token = userStore.me?.token

    // TODO: Centralize error handling
    if (!channel || !token) {
      addErrorToast(null, 'Unable to locate conversation to send message.')
      return Promise.reject(channel || token)
    }

    // TODO: Replace this with ts-results
    return new Promise((resolve, reject) => {
      channel
        .push('send_message', {
          token,
          content,
        })
        .receive('ok', (res) => {
          console.log('ok')
          console.log(res)
          resolve(res)
        })
        .receive('error', (err) => {
          console.log('error')
          console.error(err)
          addErrorToast(null, 'Unable to locate conversation to send message.')
          reject(err)
        })
        .receive('timeout', (err) => {
          console.log('timeout')
          console.error(err)
          addErrorToast(null, 'Unable to locate conversation to send message.')
          reject(err)
        })
    })
  }

  function receiveNewMessage(conversationId: ConversationId, msg: z.infer<typeof message>) {
    console.log(msg)
    const messageRes = message.safeParse(msg)
    if (!messageRes.success) {
      addErrorToast(messageRes.error, 'Message shape not recognized.')
      return
    }

    const { id, sender, updated_at, content, inserted_at } = messageRes.data
    const conversationMessage: ConversationMessage = {
      id,
      sender,
      content,
      createTime: new Date(inserted_at),
      updateTime: new Date(updated_at),
      status: 'complete',
    }

    messageStore.addMessage(conversationId, conversationMessage)
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
    transmitNewMessage,
    receiveNewMessage,
    transmitConversationAliasChanged,
    receiveConversationAliasChanged,
  }
})
