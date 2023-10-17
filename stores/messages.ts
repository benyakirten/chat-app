import { defineStore, skipHydrate } from 'pinia'
import { v4 as uuid } from 'uuid'

import { useUsersStore } from './users'
import { useToastStore } from './toasts'

export type ConversationId = string
export type MessageId = string
export type UserId = string

export const TYPING_TIMEOUT = 2_000

export interface UserConversationState {
  state: 'typing' | 'idle'
  lastRead: Date
}

export interface Conversation {
  id: ConversationId
  members: Map<UserId, UserConversationState>
  messages: Map<MessageId, ConversationMessage>
  isPrivate: boolean
  typingTimeout?: NodeJS.Timeout
  alias: string | null
  draft?: string
}

// TODO: Determine how to handle deleted messages
export interface ConversationMessage {
  sender: UserId
  id: MessageId
  content: string
  status: 'pending' | 'error' | 'complete'
  createTime: Date
  updateTime: Date
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

  const visibleConversations = computed(() => {
    if (!filteredConversationIds.value) {
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

  function addMessage(conversationId: ConversationId, message: ConversationMessage) {
    if (!userStore.me) {
      toastStore.add('You must be logged in to receive or send messages', { type: 'error' })
    }

    const convo = conversation.value(conversationId)
    if (!convo) {
      toastStore.add('Unable to find conversation', { type: 'error' })
      return
    }

    convo.messages.set(message.id, message)

    if (route.params['id'] === conversationId && !document.hidden && message.sender !== userStore.me?.id) {
      socketStore.transmitConversationRead(convo.id)
    }
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
    const convoMessage: ConversationMessage = {
      sender: userStore.me.id,
      id: newId,
      content: message,
      status: 'complete',
      createTime: new Date(),
      updateTime: new Date(),
    }

    addMessage(id, convoMessage)

    try {
      socketStore.transmitTypingEnded(convo.id)
      await socketStore.transmitNewMessage(id, message)
      synchronizeMessage(id, newId, true)
    } catch (e) {
      console.error(e)
      synchronizeMessage(id, newId, false)
    }
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

  function resendMessage(message: ConversationMessage) {
    message.status = 'pending'
    // TODO: Attempt to create the message again

    // TODO: Delete the timeout when we have an actual backend
    setTimeout(() => {
      message.status = 'complete'
    }, 1000)
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

    socketStore.transmitDeleteMessage(conversationId, messageId)
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
    socketStore.transmitEditMessage(conversationId, messageId, content)
  }

  function stopMessageEdit() {
    editedMessage.value = null
  }

  function updateMessage(conversationId: ConversationId, message: ConversationMessage) {
    const convo = conversation.value(conversationId)
    convo?.messages.set(message.id, message)
  }

  async function startConversation(
    isPrivate: boolean,
    members: UserId[],
    firstMessage: string,
    alias?: string
  ): Promise<string> {
    if (isPrivate) {
      for (const conversation of conversations.value) {
        if (isPrivate && conversation.members.has(members[0])) {
          sendMessage(conversation.id, firstMessage)
          return conversation.id
        }
      }
    }

    const conversationId = await socketStore.transmitNewConversation(isPrivate, members, firstMessage, alias)
    if (typeof conversationId !== 'string') {
      throw conversationId
    }

    return conversationId
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

  return {
    conversations: skipHydrate(conversations),
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
    startConversation,
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
  }
})
