import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'

import { useUsersStore } from './users'
import { useToastStore } from './toasts'
import { exportKey, importKey } from '~/utils/encryption'
import { MESSAGE_SHAPE } from '~/utils/shapes'

export type ConversationId = string
export type MessageId = string
export type UserId = string
export type MessageGroupId = string
export type EncryptedMessages = Record<string, string>

export const TYPING_TIMEOUT = 2_000

export interface UserConversationState {
  state: 'typing' | 'idle'
  lastRead: Date
  publicKey: CryptoKey | null
}

export interface Conversation {
  id: ConversationId
  members: Map<UserId, UserConversationState>
  messages: Map<MessageId, ConversationMessage>
  isPrivate: boolean
  typingTimeout?: NodeJS.Timeout
  alias: string | null
  privateKey: CryptoKey | null
  draft?: string
  nextPage?: string
}

// TODO: Determine how to handle deleted messages
export interface ConversationMessage {
  sender: UserId
  id: MessageId
  content: string
  status: 'pending' | 'error' | 'complete'
  createTime: Date
  updateTime: Date
  messageGroup: MessageGroupId
}

export type UserReadTimes = Record<UserId, Date>

export const useMessageStore = defineStore('messages', () => {
  const conversations = ref<Conversation[]>([])
  const filteredConversationIds = ref<ConversationId[] | null>(null)
  const editedMessage = ref<{ conversationId: ConversationId; messageId: MessageId } | null>(null)

  const userStore = useUsersStore()
  const toastStore = useToastStore()
  const socketStore = useSocketStore()
  const route = useRoute()

  const conversationMessagesRequestId = ref('')
  const activeRequestToken = ref('')
  let abortController = new AbortController()

  const unreadMessages = computed(() => (conversation?: Conversation) => {
    if (!conversation || !userStore.me) {
      return 0
    }

    const myConversationDetails = conversation.members.get(userStore.me.id)
    if (!myConversationDetails) {
      return 0
    }

    let unreadMessages = 0
    for (const message of conversation.messages.values()) {
      if (userStore.me.id === message.sender) {
        continue
      }

      if (message.createTime.valueOf() > myConversationDetails.lastRead.valueOf()) {
        unreadMessages++
      }
    }

    return unreadMessages
  })

  function moveConversationToTop(conversation: Conversation) {
    const historyIndex = conversations.value.findIndex((convo) => convo.id === conversation.id)

    if (conversations.value.length > 1 && historyIndex === conversations.value.length - 1) {
      return
    }

    if (historyIndex !== -1) {
      conversations.value.splice(historyIndex, 1)
    }

    conversations.value.push(conversation)
  }

  const conversation = computed(() => (id: ConversationId) => conversations.value.find((convo) => convo.id === id))
  const conversationCanChange = computed(() => (conversationId: ConversationId) => {
    const convo = conversation.value(conversationId)
    if (!convo) {
      return false
    }

    for (const member of convo.members.values()) {
      if (!member.publicKey) {
        return false
      }
    }

    return true
  })

  const visibleConversations = computed(() => {
    // TODO: Add ability to search conversations
    if (!filteredConversationIds.value || filteredConversationIds.value.length === 0) {
      return conversations.value
    }

    return filteredConversationIds.value.reduce<Conversation[]>((acc, next) => {
      const convo = conversation.value(next)
      if (!convo) {
        return acc
      }
      return [...acc, convo]
    }, [])
  })

  async function getNextMessagePage(conversation: Conversation, token: string) {
    if (activeRequestToken.value === token) {
      return
    }

    if (conversation.id !== conversationMessagesRequestId.value) {
      abortController.abort()
      abortController = new AbortController()
      conversationMessagesRequestId.value = conversation.id
    }

    const { signal } = abortController
    activeRequestToken.value = token
    const query = new URLSearchParams({ conversation_id: conversation.id, page_token: token })
    const res = await useAuthedFetch(`/api/messages?${query}`, 'GET', undefined, { signal })

    if (res.error.value) {
      toastStore.addErrorToast(
        res.error,
        `Unable to find additional messages for ${getConversationName(conversation.id)}`
      )
      return
    }

    const messagesResponse = MESSAGES_QUERY_SHAPE.safeParse(res.data.value)
    if (!messagesResponse.success) {
      toastStore.addErrorToast(
        res.data.value,
        'Received unexpected shape from server. Unable to find load additional messages.'
      )
      return
    }

    const { items, page_token } = messagesResponse.data.messages
    conversation.nextPage = page_token
    for (const message of items) {
      const conversationMessage: ConversationMessage = {
        sender: message.sender,
        id: message.id,
        content: message.content,
        status: 'complete',
        createTime: new Date(message.inserted_at),
        updateTime: new Date(message.updated_at),
        messageGroup: message.message_group,
      }
      conversation.messages.set(message.id, conversationMessage)
    }
  }

  // This function will also be called when a channel is told that another user has read a conversation
  function viewConversation(conversationId: ConversationId, userId: UserId | undefined = userStore.me?.id) {
    if (!userId) {
      // TODO: Error handling
      return
    }

    const convo = conversation.value(conversationId)
    if (!convo) {
      // TODO: Error handling
      return
    }

    const member = convo.members.get(userId)
    if (!member) {
      // TODO: Error handling
      return
    }

    member.lastRead = new Date()
  }

  async function addMessage(conversationId: ConversationId, message: unknown) {
    const messageRes = MESSAGE_SHAPE.safeParse(message)

    if (!messageRes.success) {
      toastStore.addErrorToast(message, 'Received unexpected shape from server. Unable to receive message.')
      return
    }

    if (!userStore.me) {
      toastStore.add('You must be logged in to receive or send messages', { type: 'error' })
    }

    const convo = conversation.value(conversationId)
    if (!convo) {
      toastStore.add('Unable to find conversation', { type: 'error' })
      return
    }

    const messageData: ConversationMessage = {
      sender: messageRes.data.sender,
      id: messageRes.data.id,
      content: messageRes.data.content,
      status: 'complete',
      createTime: new Date(messageRes.data.inserted_at),
      updateTime: new Date(messageRes.data.updated_at),
      messageGroup: messageRes.data.message_group,
    }
    await addMessageToConversation(convo, messageData)

    if (route.params['id'] === conversationId && !document.hidden && messageData.sender !== userStore.me?.id) {
      socketStore.transmitConversationRead(convo.id)
    }
  }

  async function addMessageToConversation(conversation: Conversation, message: ConversationMessage) {
    if (!conversationCanChange.value(conversation.id) || !conversation.privateKey) {
      toastStore.addErrorToast(
        null,
        'Cannot receive message to private conversation until encryption has been established.'
      )
      return
    }

    const decryptedMessage = await decrypt(conversation.privateKey, message.content)
    message.content = decryptedMessage

    conversation.messages.set(message.id, message)
  }

  function startTyping(conversationId: ConversationId) {
    // Users should only be able to type in their active conversation
    const convo = conversation.value(conversationId)
    // TODO: Analyze: can this situation arise? How? Do we need to handle it?
    // Presumably it will be an error state
    if (!convo) {
      // TODO: Error handling
      return
    }

    if (convo.typingTimeout) {
      clearTimeout(convo.typingTimeout)
    } else {
      socketStore.transmitTypingStarted(convo.id)
    }

    const timeout = setTimeout(() => {
      socketStore.transmitTypingEnded(convo.id)
      convo.typingTimeout = undefined
    }, TYPING_TIMEOUT)

    convo.typingTimeout = timeout
  }

  function setUserTypingState(conversationId: ConversationId, userId: UserId, state: UserConversationState['state']) {
    const convo = conversation.value(conversationId)
    if (!convo) {
      console.error(`Unable to locate conversation with ID ${conversationId}`)
    }

    const member = convo?.members.get(userId)
    if (!member) {
      console.error(`Unable to locate user with ID ${userId} in conversation ${conversationId}`)
      return
    }

    member.state = state
  }

  async function sendMessage(id: ConversationId, message: string) {
    // Conversation ID is in case we want to programmatically send messages
    // outside of the active conversation
    if (!userStore.me) {
      return
    }

    const convo = conversation.value(id)
    if (!convo) {
      // TODO: Error handling - must have an active conversation to send a message
      return
    }

    // TODO: Consider if this should be null
    convo.draft = undefined
    const { typingTimeout } = convo
    if (typingTimeout) {
      clearTimeout(typingTimeout)
      convo.typingTimeout = undefined
      // TODO: Transmit that typing has ended
    }

    const newId = uuid()

    const encryptedMessages = await encryptMessageToAll(convo, message)
    if (!encryptedMessages) {
      toastStore.addErrorToast(null, 'Cannot send message until encryption has been established.')
      return
    }
    const convoMessage: ConversationMessage = {
      sender: userStore.me.id,
      id: newId,
      content: message,
      status: 'complete',
      createTime: new Date(),
      updateTime: new Date(),
      messageGroup: newId,
    }

    convo.messages.set(newId, convoMessage)

    try {
      socketStore.transmitTypingEnded(convo.id)
      await socketStore.transmitNewMessage(id, encryptedMessages)
      synchronizeMessage(id, newId, true)
    } catch (e) {
      synchronizeMessage(id, newId, false)
    }
  }

  async function encryptMessageToAll(conversation: Conversation, message: string): Promise<EncryptedMessages | null> {
    const promises: Promise<{ userId: UserId; encryptedMessage: string }>[] = []
    for (const [userId, member] of conversation.members.entries()) {
      if (!member.publicKey) {
        return null
      }
      const promise = async () => {
        const encryptedMessage = await encrypt(member.publicKey!, message)
        return { userId, encryptedMessage }
      }
      promises.push(promise())
    }

    const results = await Promise.all(promises)

    return results.reduce<Record<string, string>>((acc, { userId, encryptedMessage }) => {
      acc[userId] = encryptedMessage
      return acc
    }, {})
  }

  /**
   * Optimistic updates will add the message with loading
   * However, update/create time and ID will be different and need to be updated
   */
  function synchronizeMessage(conversationId: ConversationId, messageId: MessageId, successful: boolean) {
    const convo = conversation.value(conversationId)
    if (!convo) {
      // TODO: Error handling
      return
    }

    const message = convo.messages.get(messageId)
    if (!message) {
      // TODO: Error handling
      return
    }

    if (!successful) {
      message.status = 'error'
      return
    }

    // Just remove the temporary message
    convo.messages.delete(messageId)
  }

  async function resendMessage(conversationId: ConversationId, message: ConversationMessage) {
    if (message.status !== 'error') {
      toastStore.addErrorToast(null, 'Cannot resend a message which was incorrectly sent.')
      return
    }

    const convo = conversation.value(conversationId)
    if (!convo) {
      toastStore.addErrorToast(null, 'Cannot locate conversation for the message..')
      return
    }

    message.status = 'pending'
    const encryptedMessages = await encryptMessageToAll(convo, message.content)
    if (!encryptedMessages) {
      toastStore.addErrorToast(null, 'Cannot send message until encryption has been established.')
      return
    }

    try {
      socketStore.transmitTypingEnded(convo.id)
      await socketStore.transmitNewMessage(convo.id, encryptedMessages)
      synchronizeMessage(convo.id, message.id, true)
    } catch (e) {
      synchronizeMessage(convo.id, message.id, false)
    }
  }

  function deleteMessage(conversationId: ConversationId, messageId: MessageId) {
    const convo = conversation.value(conversationId)
    if (!convo) {
      toastStore.add('Error deleting message', { type: 'error' })
      return
    }

    const message = convo.messages.get(messageId)
    if (!message) {
      toastStore.add('Error deleting message', { type: 'error' })
      return
    }

    if (!userStore.me || message.sender !== userStore.me.id) {
      toastStore.add("You cannot delete a message you didn't write", { type: 'error' })
      return
    }

    socketStore.transmitDeleteMessage(conversationId, message.messageGroup)
  }

  function removeMessage(conversationId: ConversationId, messageId: MessageId) {
    const convo = conversation.value(conversationId)
    convo?.messages.delete(messageId)
  }

  function startMessageEdit(conversationId: ConversationId, message: ConversationMessage) {
    if (!userStore.me || message.sender !== userStore.me.id) {
      // TODO: Error handling - can't edit others' messages
      return
    }

    editedMessage.value = { conversationId, messageId: message.id }
  }

  async function editMessage(content: string) {
    if (!editedMessage.value) {
      // TODO: Error handling
      return
    }

    const { conversationId, messageId } = editedMessage.value

    const convo = conversation.value(conversationId)
    if (!convo) {
      // TODO: Error handling
      return
    }

    const message = convo.messages.get(messageId)
    if (!message) {
      // TODO: Error handling
      return
    }

    if (message.content === content) {
      return
    }

    // TODO: Transmit new message content - if successful, we'll get a new update time
    stopMessageEdit()

    const encryptedMessages = await encryptMessageToAll(convo, content)
    if (!encryptedMessages) {
      toastStore.addErrorToast(null, 'Cannot send message until encryption has been established.')
      return
    }

    socketStore.transmitEditMessage(conversationId, messageId, encryptedMessages)
  }

  function stopMessageEdit() {
    editedMessage.value = null
  }

  function updateMessage(conversationId: ConversationId, message: ConversationMessage) {
    const convo = conversation.value(conversationId)
    convo?.messages.set(message.id, message)
  }

  /**
   * If the conversation is already made (available either locally or from the server), get it
   * so we don't create keys for a conversation that already exists.
   */
  async function checkForPrexistingConversation(
    otherUserId: UserId
  ): Promise<{ conversation: Conversation; needsSocket: boolean } | null> {
    let conversation = conversations.value.find((convo) => convo.isPrivate && convo.members.has(otherUserId))
    if (conversation) {
      return { conversation, needsSocket: false }
    }

    const res = await useAuthedFetch(`/api/conversation?privateWithUser=${otherUserId}`, 'GET')
    if (res.error.value) {
      toastStore.addErrorToast(
        res.error,
        `Unable to start conversation with user ${userStore.getUserName(otherUserId)}`
      )
      throw res.error
    }

    const existingConversationShape = PRIVATE_CONVERSATION_SHAPE.safeParse(res.data.value)
    if (!existingConversationShape.success) {
      toastStore.addErrorToast(res.data.value, 'Received unexpected shape from server. Unable to create conversation.')
      throw res.error
    }

    const { conversation_id } = existingConversationShape.data

    if (!conversation_id) {
      return null
    }

    conversation = {
      id: conversation_id,
      members: new Map(),
      messages: new Map(),
      isPrivate: true,
      alias: null,
      privateKey: null,
    }
    return { conversation, needsSocket: true }
  }

  async function startPrivateConversation(otherUserId: UserId): Promise<string> {
    try {
      const existingConversation = await checkForPrexistingConversation(otherUserId)
      if (existingConversation) {
        const { conversation, needsSocket } = existingConversation
        if (!needsSocket) {
          return conversation.id
        }

        conversations.value.push(conversation)
        socketStore.joinConversation(conversation)
        return conversation.id
      }

      const { privateKey, publicKey } = await generateKeys()
      const jsonPublicKey = await exportKey(publicKey)
      const jsonPrivateKey = await exportKey(privateKey)

      const conversationId = await socketStore.transmitNewPrivateConversation(
        otherUserId,
        jsonPublicKey,
        jsonPrivateKey
      )
      return conversationId
    } catch (e) {
      toastStore.addErrorToast(e, 'Error starting group conversation')
      throw e
    }
  }

  async function startGroupConversation(members: UserId[], alias?: string): Promise<string> {
    try {
      const conversationId = socketStore.transmitNewGroupConversation(members, alias)
      return conversationId
    } catch (e) {
      toastStore.addErrorToast(e, 'Error starting group conversation')
      throw e
    }
  }

  function getConversationName(conversationId: ConversationId): string {
    const convo = conversation.value(conversationId)
    if (!convo || !userStore.me) {
      return `Conversation with ID ${conversationId}`
    }

    if (convo.alias && !convo.isPrivate) {
      return convo.alias
    }

    const memberNames: string[] = []
    for (const userId of convo.members.keys()) {
      if (userId === userStore.me.id) {
        continue
      }

      const username = userStore.users.get(userId)?.name
      if (!username) {
        continue
      }

      memberNames.push(username)
    }

    return `conversation with ${memberNames.join(', ')}`
  }

  // TODO: This will be completely modified when we have a backend
  async function modifyConversation(conversation: Conversation, members: Set<string>, alias?: string) {
    socketStore.transmitConversationEdit(conversation.id, [...members], alias)
  }

  async function leaveConversation(conversation: Conversation) {
    const result = await socketStore.transmitConversationDeparture(conversation.id)
    if (!result) {
      return false
    }

    const idx = conversations.value.findIndex((convo) => convo.id === conversation.id)
    if (idx !== -1) {
      conversations.value.splice(idx, 1)
    }

    return true
  }

  function removeUserFromConversation(conversationId: ConversationId, userId: UserId) {
    const convo = conversation.value(conversationId)
    convo?.members.delete(userId)
    // Should this have error handling and/or tell the user something went wrong?
  }

  function reset() {
    conversations.value = []
    filteredConversationIds.value = []
    editedMessage.value = null
    // TODO: Transmit that typing has ended
  }

  async function setEncryptionKey(conversationId: ConversationId, userId: UserId, publicKey: JsonWebKey) {
    if (userId === userStore.me?.id) {
      return
    }

    const convo = conversation.value(conversationId)
    if (!convo) {
      return
    }

    const member = convo.members.get(userId)
    if (!member) {
      return
    }

    member.publicKey = await importKey(publicKey, 'public')
  }

  return {
    conversations,
    visibleConversations,
    resendMessage,
    addMessage,
    startTyping,
    sendMessage,
    viewConversation,
    synchronizeMessage,
    deleteMessage,
    editedMessage,
    startMessageEdit,
    editMessage,
    stopMessageEdit,
    unreadMessages,
    startGroupConversation,
    startPrivateConversation,
    modifyConversation,
    leaveConversation,
    moveConversationToTop,
    conversation,
    reset,
    getConversationName,
    setUserTypingState,
    removeUserFromConversation,
    updateMessage,
    removeMessage,
    getNextMessagePage,
    setEncryptionKey,
    addMessageToConversation,
    conversationCanChange,
  }
})
