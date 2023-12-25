import { defineStore } from 'pinia'
import { Socket, Presence, type Channel, type Push } from 'phoenix'
import { z } from 'zod'

import type {
  Conversation,
  ConversationId,
  ConversationMessage,
  MessageId,
  UserConversationState,
  UserId,
} from './messages'
import { CHANNEL_JOIN_SHAPE } from '~/utils/shapes'
import { importKey } from '~/utils/encryption'

export const useSocketStore = defineStore('socket', () => {
  const config = useRuntimeConfig()
  const messageStore = useMessageStore()
  const toastStore = useToastStore()
  const userStore = useUsersStore()
  const authStore = useAuthStore()

  let socket: Socket | null = null
  let systemChannel: Channel | null = null
  let userChannel: Channel | null = null
  let conversationChannels: Map<ConversationId, Channel> = new Map()
  let presence: Presence | null = null

  enum SocketEvent {
    // Channel join events
    JOIN_SYSTEM_CHANNEL = 'join_system_channel',
    JOIN_USER_CHANNEL = 'join_user_channel',
    JOIN_CONVERSATION_CHANNEL = 'join_conversation_channel',

    // Message transmission events
    SET_ENCRYPTION_KEYS = 'set_encryption_keys',
    SEND_MESSAGE = 'send_message',
    READ_CONVERSATION = 'read_conversation',
    EDIT_MESSAGE = 'edit_message',
    DELETE_MESSAGE = 'delete_message',
    START_TYPING = 'start_typing',
    FINISH_TYPING = 'finish_typing',

    // Channel events
    START_PRIVATE_CONVERSATION = 'start_private_conversation',
    START_GROUP_CONVERSATION = 'start_group_conversation',
    CHANGE_ALIAS = 'change_alias',
    MODIFY_CONVERSATION = 'modify_conversation',
    LEAVE_CONVERSATION = 'leave_conversation',

    // User settings
    SET_DISPLAY_NAME = 'set_display_name',
    SET_HIDDEN = 'set_hidden',
  }

  const reattemptMap = new Map<SocketEvent, number>()
  const REATTEMPT_LIMIT = 3

  function canReattempt(error: string, event: SocketEvent): boolean {
    const eventReattempts = reattemptMap.get(event) ?? 0
    if (error === 'invalid_token' && eventReattempts < REATTEMPT_LIMIT) {
      reattemptMap.set(event, eventReattempts + 1)
      return true
    }

    return false
  }

  function resetReattempts(event: SocketEvent) {
    reattemptMap.set(event, 0)
  }

  function createStandardSocketEventHandlers<T>(
    initialEvent: () => Push,
    event: SocketEvent,
    successCallback: ((response: unknown) => Promise<T>) | ((response: unknown) => T),
    errorMessage: string
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      initialEvent()
        .receive('ok', async (data) => {
          resetReattempts(event)
          const callbackPromise = successCallback?.(data)
          resolve(callbackPromise)
          return
        })
        .receive('error', async (error) => {
          if (canReattempt(error, event)) {
            const loginSuccessful = await authStore.startAuthStatePromise()
            if (loginSuccessful) {
              const res = await createStandardSocketEventHandlers<T>(initialEvent, event, successCallback, errorMessage)
              resolve(res)
              return
            }
          }

          toastStore.addErrorToast(error, errorMessage)
          reject(error)
        })
    })
  }

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

    createStandardSocketEventHandlers(
      () => systemChannel!.join(),
      SocketEvent.JOIN_SYSTEM_CHANNEL,
      () => true,
      'Unable to join system channel.'
    )

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

    createStandardSocketEventHandlers(
      () => userChannel!.join(),
      SocketEvent.JOIN_USER_CHANNEL,
      () => {},
      'Unable to join user channel.'
    )
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

  async function transmitNewEncryptionKeys(
    channel: Channel,
    conversationName: string,
    publicKey: CryptoKey,
    privateKey: CryptoKey
  ): Promise<CryptoKey | null> {
    const exportedPublicKey = await exportKey(publicKey)
    const exportedPrivateKey = await exportKey(privateKey)

    return createStandardSocketEventHandlers(
      () =>
        channel.push('set_encryption_keys', {
          token: userStore.me?.token,
          public_key: exportedPublicKey,
          private_key: exportedPrivateKey,
        }),
      SocketEvent.SET_ENCRYPTION_KEYS,
      () => privateKey,
      `Error creating encryption for ${conversationName}.`
    )
  }

  async function handleConversationJoin(
    channel: Channel,
    conversation: Conversation,
    conversationName: string,
    data: unknown
  ) {
    const parsedData = CHANNEL_JOIN_SHAPE.safeParse(data)

    if (!parsedData.success) {
      toastStore.addErrorToast(
        parsedData.error,
        `Unexpected data shape for ${conversationName}. Details for this conversation may be missing.`
      )
      return
    }

    const { private_key, public_key } = parsedData.data
    const { items, page_token } = parsedData.data.messages

    const publicKey = public_key && (await importKey(public_key, 'public'))
    let privateKey = private_key && (await importKey(private_key, 'private'))

    if (conversation.isPrivate && !privateKey) {
      const keys = await generateKeys()
      privateKey = await transmitNewEncryptionKeys(channel, conversationName, keys.publicKey, keys.privateKey)
    }

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
  }

  function setupChannelJoinHandlers(channel: Channel, conversation: Conversation, conversationName: string) {
    createStandardSocketEventHandlers(
      () => channel.join(),
      SocketEvent.JOIN_CONVERSATION_CHANNEL,
      (data) => handleConversationJoin(channel, conversation, conversationName, data),
      `Unable to join ${conversationName}.`
    )

    channel.on('new_message', (msg) => receiveNewMessage(conversation.id, msg.message))
    channel.on('read_conversation', (msg) => messageStore.viewConversation(conversation.id, msg.user_id))
    channel.on('start_typing', ({ user_id }) => messageStore.setUserTypingState(conversation.id, user_id, 'typing'))
    channel.on('finish_typing', ({ user_id }) => messageStore.setUserTypingState(conversation.id, user_id, 'idle'))
    channel.on('leave_conversation', ({ user_id }) => messageStore.removeUserFromConversation(conversation.id, user_id))
    channel.on('update_message', ({ message }) => receiveMessageUpdate(conversation.id, message))
    channel.on('delete_message', ({ message_id }) => messageStore.removeMessage(conversation.id, message_id))
    channel.on('update_alias', ({ conversation }) => receiveConversationAliasChanged(conversation))
    channel.on('set_encryption_key', ({ public_key, user_id }) =>
      messageStore.setEncryptionKey(conversation.id, user_id, public_key)
    )
  }

  async function transmitConversationDeparture(conversationId: ConversationId): Promise<boolean> {
    const conversationName = messageStore.getConversationName(conversationId)
    const errorMessage = `Unable to leave ${conversationName}.`
    const res = await transmitBasicEvent(conversationId, SocketEvent.LEAVE_CONVERSATION, {}, errorMessage)

    if (res) {
      const channel = conversationChannels.get(conversationId)
      if (channel) {
        channel.leave()
        conversationChannels.delete(conversationId)
      }
    }

    return res
  }

  function transmitConversationRead(conversationId: ConversationId) {
    const conversationName = messageStore.getConversationName(conversationId)
    return transmitBasicEvent(
      conversationId,
      SocketEvent.READ_CONVERSATION,
      {},
      `Unable to transmit read status for ${conversationName}`
    )
  }

  async function transmitNewMessage(conversationId: ConversationId, content: string): Promise<z.infer<typeof message>> {
    // This can throw because the payload is more complicated than a boolean
    const { channel, token } = getChannelAndToken(conversationId, 'Unable to locate conversation to send message.')

    // TODO: Centralize error handling
    if (!channel || !token) {
      return Promise.reject(channel || token)
    }

    return createStandardSocketEventHandlers(
      () =>
        channel.push('send_message', {
          token,
          content,
        }),
      SocketEvent.SEND_MESSAGE,
      (res) => res as any,
      'Unable to send message.'
    )
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
      SocketEvent.CHANGE_ALIAS,
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

    return transmitToBooleanPromise(systemChannel, SocketEvent.SET_HIDDEN, { token, hidden }, errorMessage)
  }

  function receiveConversationAliasChanged(convo: z.infer<typeof conversation>) {
    const _conversation = messageStore.conversation(convo.id)
    if (!_conversation) {
      return
    }

    _conversation.alias = convo.alias
  }

  function transmitTypingStarted(conversationId: ConversationId) {
    transmitTypingStateChange(conversationId, SocketEvent.START_TYPING)
  }

  function transmitTypingEnded(conversationId: ConversationId) {
    transmitTypingStateChange(conversationId, SocketEvent.FINISH_TYPING)
  }

  function transmitTypingStateChange(conversationId: ConversationId, eventName: SocketEvent) {
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
      SocketEvent.EDIT_MESSAGE,
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
    return transmitBasicEvent(
      conversationId,
      SocketEvent.DELETE_MESSAGE,
      { message_id: messageId },
      'Unable to delete message.'
    )
  }

  function transmitBasicEvent(
    conversationId: ConversationId,
    event: SocketEvent,
    payload: object,
    errorMessage: string
  ) {
    const conversationName = messageStore.getConversationName(conversationId)
    const { channel, token } = getChannelAndToken(conversationId, `Unable to locate ${conversationName}`)
    if (!channel || !token) {
      return Promise.resolve(false)
    }

    return transmitToBooleanPromise(channel, event, { token, ...payload }, errorMessage)
  }

  function transmitToBooleanPromise(
    channel: Channel,
    event: SocketEvent,
    payload: object,
    errorMessage: string
  ): Promise<boolean> {
    return createStandardSocketEventHandlers(
      () => channel.push(event, payload),
      event,
      () => true,
      errorMessage
    )
  }

  function transmitConversationEdit(
    conversationId: ConversationId,
    new_members: UserId[] = [],
    alias: string | null = null
  ) {
    return transmitBasicEvent(
      conversationId,
      SocketEvent.MODIFY_CONVERSATION,
      { new_members, alias },
      'Unable to modify conversation.'
    )
  }

  async function transmitNewPrivateConversation(
    userId: UserId,
    publicKey: JsonWebKey,
    privateKey: JsonWebKey
  ): Promise<string> {
    if (!userStore.me || !systemChannel) {
      const err = new Error('Token or system channel unavailable.')
      toastStore.addErrorToast(err, err.message)
      throw err
    }

    const { token } = userStore.me

    return createStandardSocketEventHandlers(
      () =>
        systemChannel!.push('start_private_conversation', {
          token,
          other_user_id: userId,
          public_key: publicKey,
          private_key: privateKey,
        }),
      SocketEvent.START_PRIVATE_CONVERSATION,
      (id) => id as string,
      'Unable to start private conversation.'
    )
  }

  async function transmitNewGroupConversation(members: UserId[], alias?: string): Promise<string> {
    if (!userStore.me || !systemChannel) {
      const err = new Error('Token or system channel unavailable.')
      toastStore.addErrorToast(err, err.message)
      throw err
    }

    const { token } = userStore.me
    return createStandardSocketEventHandlers(
      () =>
        systemChannel!.push('start_group_conversation', {
          token,
          alias,
          user_ids: [...members, userStore.me!.id],
        }),
      SocketEvent.START_GROUP_CONVERSATION,
      (id) => id as string,
      'Unable to start group conversation.'
    )
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
    let errorMessage: string | null = null
    if (!userStore.me) {
      errorMessage = 'Unable to get user'
    } else if (!systemChannel) {
      errorMessage = 'Unable to get system channel'
    } else if (!userStore.me.token) {
      errorMessage = 'Unable to get user token'
    }

    if (errorMessage) {
      toastStore.addErrorToast(null, errorMessage)
      throw new Error(errorMessage)
    }

    return createStandardSocketEventHandlers(
      () => systemChannel!.push('set_display_name', { token: userStore.me!.token, display_name: displayName }),
      SocketEvent.SET_DISPLAY_NAME,
      () => true,
      'Unable to set display name'
    )
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
