import { defineStore } from 'pinia'
import { Socket, Presence, type Channel } from 'phoenix'
import { z } from 'zod'

import { Conversation, ConversationId, ConversationMessage, MessageId, UserId } from './messages'
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
  let presence: Presence | null = null

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
    socket.onError((err) =>
      toastStore.addErrorToast(
        err,
        'Unable to connect to system channel. Please attempt to reload the page or log out then back in'
      )
    )

    // TODO: Abstract this and handle errors better?
    systemChannel = socket.channel('system:general', { token, hidden })
    systemChannel.onError((reason) => toastStore.addErrorToast(reason, reason))
    systemChannel.join().receive('error', (reason) => toastStore.addErrorToast(reason, reason))
    systemChannel.on('user_disconnect', ({ user_id }) => userStore.setUserOnlineState(user_id, false))

    presence = new Presence(systemChannel)
    presence.onSync(() => {
      presence!.list((id) => userStore.setUserOnlineState(id, true))
    })

    userChannel = socket.channel(`user:${id}`, { token })
    userChannel.onError((reason) => toastStore.addErrorToast(reason, reason))
    userChannel.join().receive('error', (reason) => toastStore.addErrorToast(reason, reason))

    for (const conversation of messageStore.conversations) {
      joinConversation(conversation)
    }
  }

  function joinConversation(conversation: Conversation) {
    const token = userStore.me?.token
    const conversationName = messageStore.getConversationName(conversation.id)
    if (!socket) {
      toastStore.addErrorToast(conversation, `Unable to join ${conversationName}.`)
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
          console.log(data)
          console.log(parsedData.error)
          toastStore.addErrorToast(
            parsedData.error,
            `Unexpected data shape for ${conversationName}. Details for this conversation may be missing`
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
        toastStore.addErrorToast(error, `Unable to join ${conversationName}.`)
      })

    channel.on('new_message', (msg) => receiveNewMessage(conversation.id, msg.message))
    channel.on('read_conversation', (msg) => messageStore.viewConversation(conversation.id, msg.user_id))
    channel.on('start_typing', ({ user_id }) => messageStore.setUserTypingState(conversation.id, user_id, 'typing'))
    channel.on('finish_typing', ({ user_id }) => messageStore.setUserTypingState(conversation.id, user_id, 'idle'))
    channel.on('leave_conversation', ({ user_id }) => messageStore.removeUserFromConversation(conversation.id, user_id))
    channel.on('update_message', ({ message }) => receiveMessageUpdate(conversation.id, message))
  }

  function transmitConversationDeparture(conversationId: ConversationId): Promise<boolean> {
    const conversationName = messageStore.getConversationName(conversationId)
    const errorMessage = `Unable to leave channel ${conversationName}.`
    return transmitBasicEvent(conversationId, 'leave_channel', {}, errorMessage)
  }

  function transmitNameChanged(newName: string) {
    //
  }

  function receiveNameChanged(userId: UserId, newName: string) {
    //
  }

  function transmitConversationRead(conversationId: ConversationId) {
    const conversationName = messageStore.getConversationName(conversationId)
    const errorMessage = `Unable to transmit read status for ${conversationName}`
    return transmitBasicEvent(conversationId, 'read_conversation', {}, errorMessage)
  }

  async function transmitNewMessage(conversationId: ConversationId, content: string): Promise<z.infer<typeof message>> {
    // This can throw because the payload is more complicated than a boolean
    const { channel, token } = getChannelAndToken(conversationId, 'Unable to locate conversation to send message.')

    // TODO: Centralize error handling
    if (!channel || !token) {
      return Promise.reject(channel || token)
    }

    return new Promise((resolve, reject) => {
      channel
        .push('send_message', {
          token,
          content,
        })
        .receive('ok', (res) => resolve(res))
        .receive('error', (err) => {
          toastStore.addErrorToast(err, 'Unable to send message.')
          reject(err)
        })
        .receive('timeout', (err) => {
          toastStore.addErrorToast(err, 'Unable to communicate with server. Please try again.')
          reject(err)
        })
    })
  }

  function receiveNewMessage(conversationId: ConversationId, msg: z.infer<typeof message>) {
    const conversationMessage = parseMessage(msg)
    if (!conversationMessage) {
      return
    }

    messageStore.addMessage(conversationId, conversationMessage)
  }

  function parseMessage(msg: z.infer<typeof message>) {
    const messageRes = message.safeParse(msg)
    if (!messageRes.success) {
      toastStore.addErrorToast(messageRes.error, 'Message shape not recognized.')
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

    return conversationMessage
  }

  function transmitConversationAliasChanged(conversationId: ConversationId, alias: string) {
    //
  }

  function receiveConversationAliasChanged(conversationId: ConversationId, alias: string) {
    //
  }

  function transmitTypingStarted(conversationId: ConversationId) {
    transmitTypingStateChange(conversationId, 'start_typing')
  }

  function transmitTypingEnded(conversationId: ConversationId) {
    transmitTypingStateChange(conversationId, 'finish_typing')
  }

  function transmitTypingStateChange(conversationId: ConversationId, eventName: string) {
    const conversationName = messageStore.getConversationName(conversationId)
    const errorMessage = `People in ${conversationName} don't know you've ${
      eventName === 'start_typing' ? 'begun' : 'finished'
    } typing.`
    return transmitBasicEvent(conversationId, 'start_typing', {}, errorMessage)
  }

  function transmitEditMessage(
    conversationId: ConversationId,
    messageId: MessageId,
    content: string
  ): Promise<boolean> {
    return transmitBasicEvent(
      conversationId,
      'edit_message',
      { message_id: messageId, content },
      'Unable to edit message.'
    )
  }

  function receiveMessageUpdate(conversationId: ConversationId, msg: z.infer<typeof message>) {
    const conversationMessage = parseMessage(msg)
    if (!conversationMessage) {
      return
    }

    messageStore.updateMessage(conversationId, conversationMessage)
  }

  function transmitDeleteMessage(conversationId: ConversationId, messageId: MessageId): Promise<boolean> {
    //
  }

  function transmitBasicEvent(conversationId: ConversationId, event: string, payload: object, errorMessage: string) {
    const conversationName = messageStore.getConversationName(conversationId)
    const { channel, token } = getChannelAndToken(conversationId, `Unable to locate ${conversationName}`)
    if (!channel || !token) {
      return Promise.resolve(false)
    }

    return transmitToBooleanPromise(channel, event, { token, ...payload }, errorMessage)
  }

  function transmitToBooleanPromise(
    channel: Channel,
    event: string,
    payload: object,
    errorMessage: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      channel
        .push(event, payload)
        .receive('ok', () => resolve(true))
        .receive('error', (err) => {
          toastStore.addErrorToast(err, errorMessage)
          resolve(false)
        })
        .receive('timeout', (err) => {
          toastStore.addErrorToast(err, 'Unable to communicate with server. Please try again.')
          resolve(false)
        })
    })
  }

  function getChannelAndToken(conversationId: ConversationId, errorMessage: string) {
    const channel = conversationChannels.get(conversationId)
    const token = userStore.me?.token
    if (!channel || !token) {
      toastStore.addErrorToast(null, errorMessage)
    }
    return { channel, token }
  }

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
    transmitConversationDeparture,
    transmitNameChanged,
    receiveNameChanged,
    transmitConversationRead,
    transmitNewMessage,
    receiveNewMessage,
    transmitConversationAliasChanged,
    receiveConversationAliasChanged,
    transmitTypingStarted,
    transmitTypingEnded,
    transmitEditMessage,
    transmitDeleteMessage,
    getChannelAndToken,
    transmitBasicEvent,
    transmitToBooleanPromise,
    receiveMessageUpdate,
  }
})
