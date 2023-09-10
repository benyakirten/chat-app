import type { Conversation, ConversationId, ConversationMessage } from '@/stores/messages'

export const arrayify = <T>(item: T | T[]) => (Array.isArray(item) ? item : [item])
export const getOtherMapKey = <T, U>(map: Map<T, U>, key: T): T | null => {
  for (const mapKey of map.keys()) {
    if (mapKey !== key) {
      return mapKey
    }
  }

  return null
}

// Is this worthwhile over just using a Conversaiton[]?
export class ConversationMap extends Map<ConversationId, Conversation> {
  private _history: Conversation[] = []
  public get history() {
    return this._history.slice()
  }

  constructor(conversations: Conversation | Conversation[]) {
    super()
    this.batchAdd(arrayify(conversations))
  }

  public addMessage(id: ConversationId, message: ConversationMessage): boolean {
    const convo = this.get(id)
    const historyIndex = this._history.findIndex((convo) => convo.id === id)
    if (!convo || historyIndex === -1) {
      return false
    }

    convo.messages.set(message.id, message)
    if (historyIndex === 0) {
      return true
    }

    this._history.splice(historyIndex, 1)
    this._history.push(convo)

    return true
  }

  public add(conversation: Conversation) {
    this._history.push(conversation)
    return this.set(conversation.id, conversation)
  }

  public batchAdd(conversations: Conversation[]) {
    conversations.forEach((conversation) => this.add(conversation))
    return this
  }
}
