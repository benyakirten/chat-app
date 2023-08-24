import { defineStore } from 'pinia';

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
  sender: 'u1',
  messageId: 'c1m3',
  content: 'I\'m me. Don\'t you know me?',
  status: 'complete',
  createTime: new Date('2020-1-2'),
  updateTime: new Date('2020-1-4'),
}

const conversation1: Conversation = {
  members: ['u1', 'u2', 'u3'],
  conversationId: 'c1',
  messages: [conversation1message1, conversation1message2, conversation1message3],
  unreadMessages: 0,
}

const PROP_CONVERSATIONS: Conversation[] = [conversation1]

// TODO: Figure out how the typing indicator will work
// Is it by person or one for anyone else typing in a group conversation?
// WhatsApp shows only 1 writing indicator in a group conversation but shows
// who is writing - 1:1 conversation doesn't matter
export interface Conversation {
  conversationId: ConversationId
  members: UserId[]
  messages: ConversationMessage[]
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

export const useMessageStore = defineStore('messages', () => {
  const conversations = ref(PROP_CONVERSATIONS)
  const filteredConversationIds = ref<ConversationId[] | null>(null)


  const userStore = useUsersStore()

  const conversation = computed(() => (conversationId: ConversationId | null) => conversations.value.find(conversation => conversation.conversationId === conversationId))
  const visibleConversations = computed(() => {
    if (!filteredConversationIds.value) {
      return conversations.value
    }

    const conversationsMap = conversations.value.reduce<Map<ConversationId, Conversation>>((acc, next) => {
      acc.set(next.conversationId, next)
      return acc
    }, new Map())

    return filteredConversationIds.value.reduce<Conversation[]>((acc, next) => {
      const convo = conversationsMap.get(next)
      if (!convo) {
        return acc
      }
      return [...acc, convo]
    }, [])
  })

  function moveConversationToTheTop(conversationId: ConversationId) {
    const currentIdx = conversations.value.findIndex(conversation => conversation.conversationId === conversationId)
    if (currentIdx === -1) {
      // TODO: Error handling
      return
    }

    if (currentIdx === 0) {
      return
    }

    const [convo] = conversations.value.splice(currentIdx, 1)
    conversations.value.push(convo)
  }

  function addMessage(conversationId: ConversationId, message: ConversationMessage, to?: UserId | UserId[]) {
    // Defaults are a private message from another user
    if (!to) {
      const me = userStore.me
      if (!me) {
        // TODO: Error handling, but this might be something that should never happen
        return
      }
      to = me
    }

    const convo = conversation.value(conversationId)
    if (convo) {
      convo.messages.push(message)
      moveConversationToTheTop(conversationId)
      return
    }

    const members = [message.sender, ...to]

    const newConvo: Conversation = {
      conversationId,
      members,
      messages: [message],
      unreadMessages: 0
    }
    conversations.value.push(newConvo)
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

    const convo = conversation.value(conversationId)
    if (!convo) {
      // TODO: Error handling - must have an active conversation to send a message
      return
    }

    if (convo.members.length > 2) {
      // TODO: Send group conversation message
      return
    }

    const { timeout } = convo
    if (timeout) {
      clearTimeout(timeout)
      // TODO: Transmit that typing has ended
    }

    // In a private conversation
    const to = convo.members.find(member => member !== userStore.me)
    if (!to) {
      // TODO: Error handling
      return
    }

    // TODO: Transmit message
    addMessage(conversationId, message, to)
  }

  return { conversations, visibleConversations, conversation, moveConversationToTheTop, addMessage, startTyping, sendMessage }
})
