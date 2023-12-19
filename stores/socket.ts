import { defineStore } from 'pinia'
import { Socket, Presence, type Channel } from 'phoenix'
import { z } from 'zod'

import type {
  Conversation,
  ConversationId,
  ConversationMessage,
  MessageId,
  UserConversationState,
  UserId,
} from './messages'
import { CHANNEL_JOIN_SHAPE, encryptionKey } from '~/utils/shapes'
import { importKey } from '~/utils/encryption'

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
      toastStore.add('Unable to initiate live connection without current user. Please attempt to log in.', {
        type: 'error',
      })
      return
    }

    if (socket) {
      console.log('the socket has already been initialized.')
      return
    }

    const { token, hidden, id } = userStore.me

    socket = new Socket(config.public.wsUrl, { params: { token } })
    socket.connect()
    socket.onError((err) => console.error(err))

    // TODO: Abstract this and handle errors better?
    systemChannel = socket.channel('system:general', { token, hidden })
    systemChannel.onError((reason) => toastStore.addErrorToast(reason, reason))
    systemChannel.join().receive('error', (reason) => toastStore.addErrorToast(reason, reason))
    systemChannel.on('update_display_name', ({ user_id, display_name }) =>
      userStore.updateUser(user_id, { name: display_name })
    )

    presence = new Presence(systemChannel)
    presence.onSync(() => {
      presence?.list((id) => userStore.setUserOnlineState(id, true))

      presence?.onLeave((id, presenceState) => {
        if (id && 'metas' in presenceState && Array.isArray(presenceState.metas) && presenceState.metas.length === 0) {
          userStore.setUserOnlineState(id, false)
        }
      })
    })

    userChannel = socket.channel(`user:${id}`, { token })
    userChannel.onError((reason) => toastStore.addErrorToast(reason, reason))
    userChannel.join().receive('error', (reason) => toastStore.addErrorToast(reason, reason))
    userChannel.on('new_conversation', ({ conversation, user_ids }) => receiveNewConversation(conversation, user_ids))

    for (const conversation of messageStore.conversations) {
      joinConversation(conversation)
    }
  }

  function joinConversation(conversation: Conversation) {
    if (conversationChannels.has(conversation.id)) {
      return
    }

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
      .receive('ok', async (data) => {
        const parsedData = CHANNEL_JOIN_SHAPE.safeParse(data)

        if (!parsedData.success) {
          toastStore.addErrorToast(
            parsedData.error,
            `Unexpected data shape for ${conversationName}. Details for this conversation may be missing`
          )
          return
        }

        const { private_key, public_key } = parsedData.data
        const { items, page_token } = parsedData.data.messages

        const publicKey = public_key && (await importKey(public_key, 'public'))
        const privateKey = private_key && (await importKey(private_key, 'private'))

        conversation.nextPage = page_token
        conversation.publicKey = publicKey
        conversation.privateKey = privateKey

        for (const member of parsedData.data.users) {
          const readTime = parsedData.data.read_times[member.id]
          conversation.members.set(member.id, {
            state: 'idle',
            lastRead: new Date(readTime ?? 0),
          })
        }

        for (const message of items) {
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
      .receive('timeout', (err) => console.error(err))

    channel.on('new_message', (msg) => receiveNewMessage(conversation.id, msg.message))
    channel.on('read_conversation', (msg) => messageStore.viewConversation(conversation.id, msg.user_id))
    channel.on('start_typing', ({ user_id }) => messageStore.setUserTypingState(conversation.id, user_id, 'typing'))
    channel.on('finish_typing', ({ user_id }) => messageStore.setUserTypingState(conversation.id, user_id, 'idle'))
    channel.on('leave_conversation', ({ user_id }) => messageStore.removeUserFromConversation(conversation.id, user_id))
    channel.on('update_message', ({ message }) => receiveMessageUpdate(conversation.id, message))
    channel.on('delete_message', ({ message_id }) => messageStore.removeMessage(conversation.id, message_id))
    channel.on('update_alias', ({ conversation }) => receiveConversationAliasChanged(conversation))
  }

  async function transmitConversationDeparture(conversationId: ConversationId): Promise<boolean> {
    const conversationName = messageStore.getConversationName(conversationId)
    const errorMessage = `Unable to leave ${conversationName}.`
    const res = await transmitBasicEvent(conversationId, 'leave_conversation', {}, errorMessage)

    if (res) {
      const channel = conversationChannels.get(conversationId)
      if (channel) {
        channel.leave()
        conversationChannels.delete(conversationId)
      }
    }

    return res
  }

  function transmitNameChanged(newName: string) {
    const token = userStore.me?.token
    const errorMessage = 'Unable to update name'
    if (!token || !systemChannel) {
      toastStore.addErrorToast(null, errorMessage)
      return Promise.resolve(false)
    }

    return transmitToBooleanPromise(systemChannel, 'set_display_name', { token, display_name: newName }, errorMessage)
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
          toastStore.addErrorToast(err, 'Unable to send message')
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
    return transmitBasicEvent(
      conversationId,
      'change_alias',
      { alias },
      `Unable to rename ${messageStore.getConversationName(conversationId)}`
    )
  }

  function transmitHiddenStatusChange(hidden: boolean) {
    const token = userStore.me?.token
    const errorMessage = 'Unable to update user preference'
    if (!token || !systemChannel) {
      toastStore.addErrorToast(null, errorMessage)
      return Promise.resolve(false)
    }

    return transmitToBooleanPromise(systemChannel, 'set_hidden', { token, hidden }, errorMessage)
  }

  function receiveConversationAliasChanged(convo: z.infer<typeof conversation>) {
    const _conversation = messageStore.conversation(convo.id)
    if (!_conversation) {
      return
    }

    _conversation.alias = convo.alias
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
    return transmitBasicEvent(conversationId, eventName, {}, errorMessage)
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
    return transmitBasicEvent(conversationId, 'delete_message', { message_id: messageId }, 'Unable to delete message.')
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
    })
  }

  function transmitConversationEdit(
    conversationId: ConversationId,
    new_members: UserId[] = [],
    alias: string | null = null
  ) {
    return transmitBasicEvent(
      conversationId,
      'modify_conversation',
      { new_members, alias },
      'Unable to modify conversation.'
    )
  }

  async function transmitNewPrivateConversation(
    userId: UserId,
    publicKey: JsonWebKey,
    privateKey: JsonWebKey
  ): Promise<string> {
    // TODO
  }

  async function transmitNewGroupConversation(members: UserId[], alias?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!userStore.me || !systemChannel) {
        return reject('Token or system channel unavailable.')
      }

      const { token } = userStore.me
      systemChannel
        .push('start_group_conversation', {
          token,
          alias,
          user_ids: [...members, userStore.me.id],
        })
        .receive('ok', (id) => resolve(id))
        .receive('error', (error) => reject(error))
        .receive('timeout', (error) => reject(error))
    })
  }

  function receiveNewConversation(_conversation: z.infer<typeof conversation>, userIds: string[]) {
    const parseRes = conversation.safeParse(_conversation)
    if (!parseRes.success) {
      // TODO: Error handling?
      return
    }

    const existingConversation = messageStore.conversation(parseRes.data.id)
    if (existingConversation) {
      for (const userId of userIds) {
        if (!existingConversation.members.has(userId)) {
          existingConversation.members.set(userId, { state: 'idle', lastRead: new Date(0) })
        }
      }
      existingConversation.alias = parseRes.data.alias
      return
    }

    const members = new Map<UserId, UserConversationState>()
    for (const userId of userIds) {
      members.set(userId, { state: 'idle', lastRead: new Date(0) })
    }

    const convo: Conversation = {
      id: parseRes.data.id,
      alias: parseRes.data.alias,
      members,
      messages: new Map(),
      isPrivate: parseRes.data.private,
      privateKey: null,
      publicKey: null,
    }

    messageStore.conversations.push(convo)
    joinConversation(convo)
  }

  function transmitDisplayNameChange(displayName: string) {
    return new Promise((resolve, reject) => {
      const token = userStore.me?.token

      if (!token) {
        return reject('Unable to get user token')
      }
      if (!systemChannel) {
        return reject('Unable to get system channel')
      }

      systemChannel
        .push('set_display_name', { token, display_name: displayName })
        .receive('ok', () => resolve(true))
        .receive('error', (e) => reject(e))
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
    transmitConversationEdit,
    transmitHiddenStatusChange,
    transmitNewGroupConversation,
    transmitDisplayNameChange,
    transmitNewPrivateConversation,
  }
})
