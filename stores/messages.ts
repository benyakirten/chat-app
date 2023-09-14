import { defineStore, skipHydrate } from 'pinia'
import { v4 as uuid } from 'uuid'

import { useUsersStore } from './users'
import { useToastStore } from './toasts'

export type ConversationId = string
export type MessageId = string
export type UserId = string

export const TYPING_TIMEOUT = 2_000

const conversation2message1: ConversationMessage = {
  sender: 'u1',
  id: 'c2m1',
  content: 'HI AGAIN!',
  status: 'complete',
  createTime: new Date('2020-1-1'),
  updateTime: new Date('2020-1-1'),
}

const conversation2message2: ConversationMessage = {
  sender: 'u3',
  id: 'c2m2',
  content: 'Hi to you too. Who are you AGAIN?',
  status: 'complete',
  createTime: new Date('2020-1-2'),
  updateTime: new Date('2020-1-2'),
}

const conversation2message3: ConversationMessage = {
  sender: 'u3',
  id: 'c2m3',
  content: 'Interested in knowing?',
  status: 'complete',
  createTime: new Date('2020-1-2'),
  updateTime: new Date('2020-1-4'),
}

const conversation2message4: ConversationMessage = {
  sender: 'u1',
  id: 'c2m4',
  content: "I'm me. Don't you know me AGAIN?",
  status: 'pending',
  createTime: new Date('2020-1-4'),
  updateTime: new Date('2020-1-4'),
}

const conversation2message5: ConversationMessage = {
  sender: 'u1',
  id: 'c2m5',
  content: 'Everyone knows me AGAIN.',
  status: 'error',
  createTime: new Date('2020-1-4'),
  updateTime: new Date('2020-1-4'),
}

const conversation2message6: ConversationMessage = {
  sender: 'u1',
  id: 'c2m6',
  content: 'I can assure you AGAIN.',
  status: 'complete',
  createTime: new Date('2020-1-5'),
  updateTime: new Date('2020-1-5'),
}

const conversation2: Conversation = {
  members: new Map([
    ['u1', { state: 'idle', lastRead: new Date('2000-1-1') }],
    ['u3', { state: 'idle', lastRead: new Date() }],
  ]),
  id: 'c2',
  messages: new Map([
    [conversation2message1.id, conversation2message1],
    [conversation2message2.id, conversation2message2],
    [conversation2message3.id, conversation2message3],
    [conversation2message4.id, conversation2message4],
    [conversation2message5.id, conversation2message5],
    [conversation2message6.id, conversation2message6],
  ]),
  isPrivate: false,
}

const conversation1message1: ConversationMessage = {
  sender: 'u1',
  id: 'c1m1',
  content: 'HI!',
  status: 'complete',
  createTime: new Date('2020-1-1'),
  updateTime: new Date('2020-1-1'),
}

const conversation1message2: ConversationMessage = {
  sender: 'u2',
  id: 'c1m2',
  content: 'Hi to you too. Who are you?',
  status: 'complete',
  createTime: new Date('2020-1-2'),
  updateTime: new Date('2020-1-2'),
}

const conversation1message3: ConversationMessage = {
  sender: 'u2',
  id: 'c1m3',
  content: 'Interested in knowing?',
  status: 'complete',
  createTime: new Date('2020-1-2'),
  updateTime: new Date('2020-1-4'),
}

const conversation1message4: ConversationMessage = {
  sender: 'u1',
  id: 'c1m4',
  content: "I'm me. Don't you know me?",
  status: 'pending',
  createTime: new Date('2020-1-4'),
  updateTime: new Date('2020-1-4'),
}

const conversation1message5: ConversationMessage = {
  sender: 'u1',
  id: 'c1m5',
  content: 'Everyone knows me.',
  status: 'error',
  createTime: new Date('2020-1-4'),
  updateTime: new Date('2020-1-4'),
}

const conversation1message6: ConversationMessage = {
  sender: 'u1',
  id: 'c1m6',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-5'),
  updateTime: new Date('2020-1-5'),
}

const conversation1message7: ConversationMessage = {
  sender: 'u2',
  id: 'c1m7',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-6'),
  updateTime: new Date('2020-1-6'),
}

const conversation1message8: ConversationMessage = {
  sender: 'u1',
  id: 'c1m8',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-7'),
  updateTime: new Date('2020-1-7'),
}

const conversation1message9: ConversationMessage = {
  sender: 'u2',
  id: 'c1m9',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-8'),
  updateTime: new Date('2020-1-8'),
}

const conversation1message10: ConversationMessage = {
  sender: 'u1',
  id: 'c1m10',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-9'),
  updateTime: new Date('2020-1-9'),
}

const conversation1message11: ConversationMessage = {
  sender: 'u2',
  id: 'c1m11',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-10'),
  updateTime: new Date('2020-1-10'),
}

const conversation1message12: ConversationMessage = {
  sender: 'u1',
  id: 'c1m12',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-12'),
  updateTime: new Date('2020-1-12'),
}

const conversation1message13: ConversationMessage = {
  sender: 'u1',
  id: 'c1m13',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-13'),
  updateTime: new Date('2020-1-13'),
}

const conversation1message14: ConversationMessage = {
  sender: 'u2',
  id: 'c1m14',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-14'),
  updateTime: new Date('2020-1-14'),
}

const conversation1message15: ConversationMessage = {
  sender: 'u1',
  id: 'c1m15',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-15'),
  updateTime: new Date('2020-1-15'),
}

const conversation1message16: ConversationMessage = {
  sender: 'u2',
  id: 'c1m16',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-16'),
  updateTime: new Date('2020-1-16'),
}

const conversation1message17: ConversationMessage = {
  sender: 'u1',
  id: 'c1m17',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-17'),
  updateTime: new Date('2020-1-17'),
}

const conversation1message18: ConversationMessage = {
  sender: 'u1',
  id: 'c1m18',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-18'),
  updateTime: new Date('2020-1-18'),
}

const conversation1message19: ConversationMessage = {
  sender: 'u2',
  id: 'c1m19',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-19'),
  updateTime: new Date('2020-1-19'),
}

const conversation1message20: ConversationMessage = {
  sender: 'u1',
  id: 'c1m20',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-20'),
  updateTime: new Date('2020-1-20'),
}

const conversation1message21: ConversationMessage = {
  sender: 'u2',
  id: 'c1m21',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-21'),
  updateTime: new Date('2020-1-21'),
}

const conversation1message22: ConversationMessage = {
  sender: 'u1',
  id: 'c1m22',
  content: 'I can assure you.',
  status: 'complete',
  createTime: new Date('2020-1-22'),
  updateTime: new Date('2020-1-22'),
}

const conversation1: Conversation = {
  members: new Map([
    ['u1', { state: 'idle', lastRead: new Date() }],
    ['u2', { state: 'idle', lastRead: new Date() }],
  ]),
  id: 'c1',
  messages: new Map([
    [conversation1message1.id, conversation1message1],
    [conversation1message2.id, conversation1message2],
    [conversation1message3.id, conversation1message3],
    [conversation1message4.id, conversation1message4],
    [conversation1message5.id, conversation1message5],
    [conversation1message6.id, conversation1message6],
    [conversation1message7.id, conversation1message7],
    [conversation1message8.id, conversation1message8],
    [conversation1message9.id, conversation1message9],
    [conversation1message10.id, conversation1message10],
    [conversation1message11.id, conversation1message11],
    [conversation1message12.id, conversation1message12],
    [conversation1message13.id, conversation1message13],
    [conversation1message14.id, conversation1message14],
    [conversation1message15.id, conversation1message15],
    [conversation1message16.id, conversation1message16],
    [conversation1message17.id, conversation1message17],
    [conversation1message18.id, conversation1message18],
    [conversation1message19.id, conversation1message19],
    [conversation1message20.id, conversation1message20],
    [conversation1message21.id, conversation1message21],
    [conversation1message22.id, conversation1message22],
  ]),
  isPrivate: true,
}

const PROP_CONVERSATIONS = new ConversationMap([conversation1, conversation2])

export interface UserConversationState {
  state: 'typing' | 'idle'
  lastRead: Date
}

// TODO: Figure out how the typing indicator will work
// Is it by person or one for anyone else typing in a group conversation?
// WhatsApp shows only 1 writing indicator in a group conversation but shows
// who is writing - 1:1 conversation doesn't matter
export interface Conversation {
  id: ConversationId
  members: Map<UserId, UserConversationState>
  messages: Map<MessageId, ConversationMessage>
  isPrivate: boolean
  typingTimeout?: NodeJS.Timeout
  alias?: string
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
  const conversations = ref(PROP_CONVERSATIONS)
  const filteredConversationIds = ref<ConversationId[] | null>(null)
  const editedMessage = ref<{ conversationId: ConversationId; messageId: MessageId } | null>(null)

  const userStore = useUsersStore()
  const toastStore = useToastStore()
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
  function viewConversation(conversationId: ConversationId, userId: UserId | undefined = userStore.me?.id) {
    if (!userId) {
      // TODO: Error handling
      return
    }

    const conversation = conversations.value.get(conversationId)
    if (!conversation) {
      // TODO: Error handling
      return
    }

    const member = conversation.members.get(userId)
    if (!member) {
      // TODO: Error handling
      return
    }

    member.lastRead = new Date()

    if (userStore.me && userStore.me?.id === userId) {
      // TODO: transmit that the user has read the conversation
    }
  }

  function addMessage(conversationId: ConversationId, message: ConversationMessage) {
    if (!userStore.me) {
      toastStore.add('You must be logged in to receive or send messages', { type: 'error' })
    }

    const result = conversations.value.addMessage(conversationId, message)
    if (!result) {
      toastStore.add('Unable to add message', { type: 'error' })
      return
    }

    const conversation = conversations.value.get(conversationId)
    if (!conversation) {
      return
    }

    // TODO: Make this better
    if (route.params['id'] === conversationId && !document.hidden && message.sender !== userStore.me?.id) {
      viewConversation(conversationId)
    }
  }

  function startTyping(id: ConversationId) {
    // Users should only be able to type in their active conversation
    const convo = conversations.value.get(id)
    // TODO: Analyze: can this situation arise? How? Do we need to handle it?
    // Presumably it will be an error state
    if (!convo) {
      // TODO: Error handling
      return
    }

    if (convo.typingTimeout) {
      clearTimeout(convo.typingTimeout)
    } else {
      // TODO: Transmit that typing has started
    }

    const timeout = setTimeout(() => {
      // TODO: Transmit that typing has ended
      convo.typingTimeout = undefined
    }, TYPING_TIMEOUT)

    convo.typingTimeout = timeout
  }

  function sendMessage(id: ConversationId, message: string) {
    // Conversation ID is in case we want to programmatically send messages
    // outside of the active conversation
    if (!userStore.me) {
      // TODO: Error handling - this shouldn't be able to happen
      // If we get to this point there has been an error
      return
    }

    const convo = conversations.value.get(id)
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

    // TODO: Encrypt/transmit the message then use the api to update the data
    // i.e. call synchronizeMessage
  }

  /**
   * Optimistic updates will add the message with loading
   * However, update/create time and ID will be different and need to be updated
   */
  function synchronizeMessage(
    conversationId: ConversationId,
    oldId: MessageId,
    newId: MessageId,
    successful: boolean,
    createTime?: Date,
    updateTime?: Date
  ) {
    const conversation = conversations.value.get(conversationId)
    if (!conversation) {
      // TODO: Error handling
      return
    }

    const message = conversation.messages.get(oldId)
    if (!message) {
      // TODO: Error handling
      return
    }

    const newMessage: ConversationMessage = structuredClone(message)
    newMessage.status = successful ? 'complete' : 'error'
    if (createTime) {
      newMessage.createTime = createTime
    }

    if (updateTime) {
      newMessage.updateTime = updateTime
    }

    conversation.messages.delete(oldId)
    conversation.messages.set(newId, newMessage)
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
    const conversation = conversations.value.get(conversationId)
    if (!conversation) {
      toastStore.add('Error deleting message', { type: 'error' })
      return
    }

    const message = conversation.messages.get(messageId)
    if (!message) {
      toastStore.add('Error deleting message', { type: 'error' })
      return
    }

    if (!userStore.me || message.sender !== userStore.me.id) {
      toastStore.add("You cannot delete a message you didn't write", { type: 'error' })
      return
    }

    // TODO: Transmit that the message has been deleted
    conversation.messages.delete(messageId)
  }

  function startMessageEdit(conversationId: ConversationId, message: ConversationMessage) {
    if (!userStore.me || message.sender !== userStore.me.id) {
      // TODO: Error handling - can't edit others' messages
      return
    }

    editedMessage.value = { conversationId, messageId: message.id }
  }

  function editMessage(content: string) {
    if (!editedMessage.value) {
      // TODO: Error handling
      return
    }

    const { conversationId, messageId } = editedMessage.value

    const conversation = conversations.value.get(conversationId)
    if (!conversation) {
      // TODO: Error handling
      return
    }

    const message = conversation.messages.get(messageId)
    if (!message) {
      // TODO: Error handling
      return
    }

    if (message.content === content) {
      return
    }

    // TODO: Transmit new message content - if successful, we'll get a new update time
    message.content = content
    message.updateTime = new Date()

    stopMessageEdit()
  }

  function stopMessageEdit() {
    editedMessage.value = null
  }

  // TODO: The backend will do pretty much all of this - if we don't find a local conversation
  // we'll need to query the backend - though we may need it
  async function startPrivateConversation(otherUser: string, message: string): Promise<string> {
    if (!userStore.me) {
      throw new Error('You must be logged in to start a conversation')
    }

    let convoId: string | null = null

    for (const [id, conversation] of conversations.value) {
      if (conversation.members.size !== 2) {
        continue
      }

      // If we already have a private conversation then
      // just add the message to that conversation
      if (conversation.members.get(otherUser)) {
        addMessage(id, {
          sender: userStore.me.id,
          id: uuid(),
          content: message,
          status: 'pending',
          createTime: new Date(),
          updateTime: new Date(),
        })
        return id
      }
    }

    // No existing conversation between the user and someone else
    // So we create a new conversation and message
    const newConvo: Conversation = {
      isPrivate: true,
      id: uuid(),
      members: new Map([
        [userStore.me?.id, { state: 'idle', lastRead: new Date() }],
        [otherUser, { state: 'idle', lastRead: new Date(0) }],
      ]),
      messages: new Map(),
    }

    conversations.value.add(newConvo)
    addMessage(newConvo.id, {
      sender: userStore.me?.id,
      id: uuid(),
      content: message,
      status: 'pending',
      createTime: new Date(),
      updateTime: new Date(),
    })

    return newConvo.id
  }

  async function startGroupConversation(otherUsers: Set<string>, message: string): Promise<string> {
    if (!userStore.me) {
      throw new Error('You must be logged in to start a conversation')
    }

    if (!otherUsers || otherUsers.size === 0) {
      throw new Error('A conversation must have at least 1 other person in it')
    }

    let members: Map<UserId, UserConversationState> = new Map()
    otherUsers.forEach((userId) => {
      const user: UserConversationState = {
        state: 'idle',
        lastRead: userId === userStore.me?.id ? new Date() : new Date(0),
      }
      members.set(userId, user)
    })

    const newConvo: Conversation = {
      isPrivate: false,
      id: uuid(),
      members,
      messages: new Map(),
    }
    conversations.value.add(newConvo)
    addMessage(newConvo.id, {
      sender: userStore.me.id,
      id: uuid(),
      content: message,
      status: 'pending',
      createTime: new Date(),
      updateTime: new Date(),
    })
    return newConvo.id
  }

  // TODO: This will be completely modified when we have a backend
  async function modifyConversation(conversation: Conversation, members: Set<string>, alias?: string) {
    members.forEach((id) => {
      if (!conversation.members.has(id)) {
        conversation.members.set(id, { state: 'idle', lastRead: new Date(0) })
      }
    })

    if (alias) {
      conversation.alias = alias
    }
  }

  async function leaveConversation(conversation: Conversation) {
    conversations.value.remove(conversation)
    // TODO: Transmit that we have left the conversation
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
    startGroupConversation,
    startPrivateConversation,
    modifyConversation,
    leaveConversation,
  }
})
