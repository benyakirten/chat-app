import { defineStore } from 'pinia';

import { ConversationMap, getOtherMapKey } from '@/lib/collections';
import { useUsersStore } from './users';

export type ConversationId = string
export type MessageId = string
export type UserId = string

export const TYPING_TIMEOUT = 2_000

const conversation1message1: ConversationMessage = {
  sender: 'u1',
  messageId: 'c1m1',
  content: 'HI!',
  status: 'complete',
  createTime: new Date('2020-1-1'),
  updateTime: new Date('2020-1-1'),
}

const conversation1message2: ConversationMessage = {
  sender: 'u2',
  messageId: 'c1m2',
  content: 'Hi to you too. Who are you?',
  status: 'complete',
  createTime: new Date('2020-1-2'),
  updateTime: new Date('2020-1-2'),
}

const conversation1message3: ConversationMessage = {
  sender: 'u2',
  messageId: 'c1m3',
  content: 'Interested in knowing?',
  status: 'complete',
  createTime: new Date('2020-1-2'),
  updateTime: new Date('2020-1-4'),
}


const conversation1message4: ConversationMessage = {
  sender: 'u1',
  messageId: 'c1m4',
  content: 'I\'m me. Don\'t you know me?',
  status: 'complete',
  createTime: new Date('2020-1-4'),
  updateTime: new Date('2020-1-4'),
}

const conversation1message5: ConversationMessage = {
  sender: 'u1',
  messageId: 'c1m5',
  content: 'Everyone knows me.',
  status: 'complete',
  createTime: new Date('2020-1-4'),
  updateTime: new Date('2020-1-4'),
}

const conversation1: Conversation = {
  members: new Map([['u1', { state: 'idle', lastRead: new Date() }], ['u2', { state: 'idle', lastRead: new Date() }]]),
  conversationId: 'c1',
  messages: new Map([
    [conversation1message1.messageId, conversation1message1],
    [conversation1message2.messageId, conversation1message2],
    [conversation1message3.messageId, conversation1message3],
    [conversation1message4.messageId, conversation1message4],
    [conversation1message5.messageId, conversation1message5]
  ]),
  unreadMessages: 4,
}

const PROP_CONVERSATIONS = new ConversationMap(conversation1)

export interface UserConversationState {
  state: 'typing' | 'idle', lastRead: Date
}

// TODO: Figure out how the typing indicator will work
// Is it by person or one for anyone else typing in a group conversation?
// WhatsApp shows only 1 writing indicator in a group conversation but shows
// who is writing - 1:1 conversation doesn't matter
export interface Conversation {
  conversationId: ConversationId
  members: Map<UserId, UserConversationState>
  messages: Map<MessageId, ConversationMessage>
  timeout?: NodeJS.Timeout
  // Unread messages will be given by the server immediately
  // Added to when a message is received in a conversation that's currently not active
  // And reduced to 0 when a conversation is read
  unreadMessages: number
}

// TODO: Determine how to handle deleted messages
export interface ConversationMessage {
  sender: UserId
  messageId: MessageId
  content: string
  status: 'pending' | 'error' | 'complete'
  createTime: Date
  updateTime: Date
}

export type UserReadTimes = Record<UserId, Date>

export const useMessageStore = defineStore('messages', () => {
  const conversations = ref(PROP_CONVERSATIONS)
  const filteredConversationIds = ref<ConversationId[] | null>(null)

  const userStore = useUsersStore()

  const visibleConversations = computed(() => {
    if (!filteredConversationIds.value) {
      return conversations.value.history
    }

    return filteredConversationIds.value.reduce<Conversation[]>((acc, next) => {
      const convo = conversations.value.get(next)
      if (!convo) {
        return acc
      }
      return [...acc, convo]
    }, [])
  })

  // This function will also be called when a channel is told that another user has read a conversation
  function viewConversation(conversation: Conversation, userId: UserId | null = userStore.me) {
    if (!userId) {
      // TODO: Error handling
      return
    }

    const member = conversation.members.get(userId)
    if (!member) {
      // TODO: Error handling
      return
    }

    if (userId === userStore.me) {
      conversation.unreadMessages = 0
      // TODO: transmit that user has read the conversation
    }

    member.lastRead = new Date()
  }

  function addMessage(conversationId: ConversationId, message: ConversationMessage, to?: UserId) {
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
      conversations.value.addMessage(conversationId, message)
      return
    }

    // TODO: API call here
    const newConvo: Conversation = {
      conversationId,
      // TODO: Make this better
      members: new Map([[message.sender, { state: 'idle', lastRead: new Date() }], [to, { state: 'idle', lastRead: new Date() }]]),
      messages: new Map([[message.messageId, message]]),
      unreadMessages: 0
    }

    conversations.value.add(newConvo)
  }

  function startTyping(conversationId: ConversationId) {
    // Users should only be able to type in their active conversation
    const convo = conversations.value.get(conversationId)
    // TODO: Analyze: can this situation arise? How? Do we need to handle it?
    // Presumably it will be an error state
    if (!convo) {
      // TODO: Error handling
      return
    }

    if (convo.timeout) {
      clearTimeout(convo.timeout)
    } else {
      // TODO: Transmit that typing has started
    }

    const timeout = setTimeout(() => {
      // TODO: Transmit that typing has ended
      convo.timeout = timeout
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
    const to = getOtherMapKey(convo.members, userStore.me)
    if (!to) {
      // TODO: Error handling
      return
    }

    // TODO: Transmit message
    addMessage(conversationId, message, to)
  }

  return { conversations, visibleConversations, addMessage, startTyping, sendMessage, viewConversation }
})
