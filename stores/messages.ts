import { defineStore } from 'pinia';

import { arrayify, getOtherMapKey } from '@/lib/collections';
import { useUsersStore } from './users';

export type ConversationId = string
export type MessageId = string
export type UserId = string

export const TYPING_TIMEOUT = 5_000

const conversation1message1: ConversationMessage = {
  userId: 'u1',
  messageId: 'c1m1',
  content: 'HI!',
  status: 'read',
  createTime: new Date('2020-1-1'),
  updateTime: new Date('2020-1-1'),
}

const conversation1message2: ConversationMessage = {
  userId: 'u2',
  messageId: 'c1m2',
  content: 'Hi to you too. Who are you?',
  status: 'read',
  createTime: new Date('2020-1-2'),
  updateTime: new Date('2020-1-2'),
}

const conversation1message3: ConversationMessage = {
  userId: 'u1',
  messageId: 'c1m3',
  content: 'I\'m me. Don\'t you know me?',
  status: 'sent',
  createTime: new Date('2020-1-2'),
  updateTime: new Date('2020-1-4'),
}

const conversation1: Conversation = {
  members: new Map([['u1', 'idle'], ['u2', 'idle']]),
  conversationId: 'c1',
  messages: new Map([['c1m1', conversation1message1], ['c1m2', conversation1message2], ['c1m3', conversation1message3]])
}

const PROP_CONVERSATIONS: MessageStoreState['conversations'] = new Map([['c1', conversation1]])

export interface MessageStoreState {
  conversations: Map<ConversationId, Conversation>
  // Active conversation will be set in local storage - navigate to it
}

// TODO: Figure out how the typing indicator will work
// Is it by person or one for anyone else typing in a group conversation?
// WhatsApp shows only 1 writing indicator in a group conversation but shows
// who is writing - 1:1 conversation doesn't matter
export interface Conversation {
  conversationId: ConversationId
  members: Map<UserId, 'typing' | 'idle'>
  messages: Map<MessageId, ConversationMessage>
  timeout?: NodeJS.Timeout
}

// TODO: Determine how to handle deleted messages
export interface ConversationMessage {
  userId: UserId
  messageId: MessageId
  content: string
  status: 'pending' | 'error' | 'sent' | 'read'
  createTime: Date
  updateTime: Date
}

export const useMessageStore = defineStore('messages', () => {
  const conversations = ref(new Map<ConversationId, Conversation>(PROP_CONVERSATIONS))

  const userStore = useUsersStore()

  const conversation = computed(() => (conversationId: ConversationId) => conversations.value.get(conversationId))
  const message = computed(() => () => (conversationId: ConversationId, messageId: MessageId) => conversations.value.get(conversationId)?.messages.get(messageId))
  const timeout = computed(() => () => (conversationId: ConversationId) => conversations.value.get(conversationId)?.timeout)

  function addMessage(conversationId: ConversationId, message: ConversationMessage, from: UserId = message.userId, to?: UserId | UserId[]) {
    // Defaults are a private message from another user
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
    to = arrayify(to)
    to.forEach(recipient => {
      members.set(recipient, 'idle')
    })

    const messages = new Map<MessageId, ConversationMessage>()
    messages.set(message.messageId, message)
    const conversation: Conversation = {
      conversationId,
      members,
      messages,
    }
    conversations.value.set(conversationId, conversation)
  }

  function startTyping(conversationId: ConversationId) {
    // Users should only be able to type in their active conversation
    const currentConvo = conversations.value.get(conversationId)
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

  function sendMessage(conversationId: ConversationId, message: ConversationMessage) {
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
      // TODO: Send group conversation message
      return
    }

    const { timeout } = convo
    if (timeout) {
      clearTimeout(timeout)
      // TODO: Transmit that typing has ended
    }

    // In a private conversation
    // TODO: Outsource this to a helper function
    const to = getOtherMapKey(convo.members, userStore.me)
    if (!to) {
      // TODO: Error handling
      return
    }

    // TODO: Transmit message
    addMessage(conversationId, message, userStore.me, to)
  }

  return { conversations, conversation, message, timeout, addMessage, startTyping, sendMessage }
})
