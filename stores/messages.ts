import { defineStore } from 'pinia';
import { useUsersStore } from './users';

export type ConversationId = string
export type MessageId = string
export type UserId = string

export const TYPING_TIMEOUT = 5_000

export interface MessageStoreState {
  conversations: Map<ConversationId, Conversation>,
  // Retrieve previously active conversation on login from backend
  activeConversation: ConversationId | null
}

// TODO: Figure out how the typing indicator will work
// Is it by person or one for anyone else typing in a group conversation?
// WhatsApp shows only 1 writing indicator in a group conversation but shows
// who is writing - 1:1 conversation doesn't matter
export interface Conversation {
  members: Map<UserId, "typing" | "idle">
  messages: Map<MessageId, ConversationMessage>
  timeout?: NodeJS.Timeout
}

export interface ConversationMessage {
  userId: UserId
  messageId: MessageId
  content: string
  status: "pending" | "sent" | "read"
  time: Date
}

export const useMessageStore = defineStore("messages", () => {
  const conversations = ref(new Map<ConversationId, Conversation>())
  const activeConversation = ref<UserId | null>(null)

  const userStore = useUsersStore()

  const currentConversation = computed(() => activeConversation.value ? conversations.value.get(activeConversation.value) ?? null : null)
  const conversation = computed(() => (conversationId: ConversationId) => conversations.value.get(conversationId))
  const message = computed(() => () => (conversationId: ConversationId, messageId: MessageId) => conversations.value.get(conversationId)?.messages.get(messageId))
  const timeout = computed(() => () => (conversationId: ConversationId) => conversations.value.get(conversationId)?.timeout)

  // TODO: Reconsider how a conversation is stated/sent
  function addMessage(conversationId: ConversationId, message: ConversationMessage, from: UserId = message.userId, to?: UserId) {
    // TODO: Have a separate function for group conversation
    if (!to) {
      const me = userStore.me
      if (!me) {
        // TODO: Error handling, but this might be something that should never happen
        return
      }
      to = me
    }

    const convo = conversations.value.get(conversationId)
    if (convo) {
      convo.messages.set(message.messageId, message)
      return
    }

    const members = new Map<UserId, 'idle' | 'typing'>()
    members.set(from, 'idle')
    members.set(to, 'idle')

    const messages = new Map<MessageId, ConversationMessage>()
    messages.set(message.messageId, message)
    const conversation: Conversation = {
      members,
      messages,
    }
    conversations.value.set(conversationId, conversation)
  }

  function startTyping() {
    // Users should only be able to type in their active conversation
    const currentConvo = currentConversation.value
    // TODO: Analyze: can this situation arise? How? Do we need to handle it?
    // Presumably it will be an error state
    if (!currentConvo) {
      // TODO: Error handling
      return
    }

    if (currentConvo.timeout) {
      clearTimeout(currentConvo.timeout)
    } else {
      // TODO: Transmit that typing has started
    }

    const timeout = setTimeout(() => {
      // TODO: Transmit that typing has ended
      currentConvo.timeout = timeout
    }, TYPING_TIMEOUT)
  }

  function sendMessage(conversationId: ConversationId, message: ConversationMessage, to: UserId) {
    // Conversation ID is in case we want to programmatically send messages
    // outside of the active conversation

    if (!userStore.me) {
      // TODO: Error handling - this shouldn't be able to happen
      // If we get to this point there has been an error
      return
    }

    const convo = conversations.value.get(conversationId)
    if (!convo) {
      // TODO: Error handling - must have an active conversation to send a message
      return
    }

    if (convo.members.size > 2) {
      // TODO: Send group conversation
    }

    const { timeout } = convo
    if (timeout) {
      clearTimeout(timeout)
      // TODO: Transmit that typing has ended
    }


    addMessage(conversationId, message, userStore.me, to)

  }

  return { conversations, activeConversation, currentConversation, conversation, message, timeout, addMessage, startTyping, sendMessage }
})

