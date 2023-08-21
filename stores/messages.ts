import { defineStore } from "pinia";

export type ConversationId = string
export type MessageId = string
export type UserId = string

export interface Me {
  name: string
  userId: UserId
}

export interface MessageStoreState {
  conversations: Record<ConversationId, Conversation>,
  me: Me
}
export interface Conversation {
  members: UserId[]
  messages: Record<MessageId, ConversationMessage>
}
export interface ConversationMessage {
  userId: UserId
  messageId: MessageId
  content: string
  status: "pending" | "sent" | "read"
  time: Date
}

export const useMessageStore = defineStore("messages", {
  state(): MessageStoreState {
    return {
      me: {
        name: "Sample User",
        userId: "sample-user"
      },
      conversations: {}
    }
  },
  actions: {
    addMessage(conversationId: ConversationId, message: ConversationMessage, from: UserId = message.userId, to?: UserId) {
      to ??= this.me.userId
      if (conversationId in this.conversations) {
        this.conversations[conversationId].messages[message.messageId] = message
        return
      }

      const conversation: Conversation = {
        members: [from, to],
        messages: { [message.messageId]: message }
      }
      this.conversations[conversationId] = conversation
    },

    sendMessage(conversationId: ConversationId, message: ConversationMessage, to: UserId) {
      this.addMessage(conversationId, message, this.me.userId, to)
    }
  },
  getters: {
    conversation: (state) => (conversationId: ConversationId) => state.conversations[conversationId],
    message: (state) => (conversationId: ConversationId, messageId: MessageId) => state.conversations[conversationId]?.messages[messageId]
  }
})
