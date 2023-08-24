import { Conversation, ConversationId, ConversationMessage } from "@/stores/messages"

export const arrayify = <T>(item: T | T[]) => Array.isArray(item) ? item : [item]
export const getOtherMapKey = <T, U>(map: Map<T, U>, key: T): T | null => {
  for (const mapKey of map.keys()) {
    if (mapKey !== key) {
      return mapKey
    }
  }

  return null
}

export class ConversationMap extends Map<ConversationId, Conversation> {
  public history: Conversation[] = []

  constructor(conversations: Conversation | Conversation[]) {
    super()
    this.batchAdd(arrayify(conversations))
  }

  public addMessage(id: ConversationId, message: ConversationMessage): boolean {
    const convo = this.get(id)
    const historyIndex = this.history.findIndex(convo => convo.conversationId === id)
    if (!convo || historyIndex === -1) {
      return false
    }

    if (historyIndex === 0) {
      return true
    }

    convo.messages.set(message.messageId, message)
    this.history.splice(historyIndex, 1)
    this.history.push(convo)

    return true
  }

  public add(conversation: Conversation) {
    this.history.push(conversation)
    this.set(conversation.conversationId, conversation)
  }

  public batchAdd(conversations: Conversation[]) {
    conversations.forEach(conversation => this.add(conversation))
  }
}
