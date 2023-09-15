export const arrayify = <T>(item: T | T[]) => (Array.isArray(item) ? item : [item])
export const getFirstSetItem = <T>(set: Set<T>): T | undefined => set.keys().next().value

// Is this worthwhile over just using a Conversation[]?
export class ConversationMap extends Map<ConversationId, Conversation> {
  public history: Conversation[] = []

  constructor(conversations: Conversation | Conversation[]) {
    super()
    this.batchAdd(arrayify(conversations))
  }

  public addMessage(id: ConversationId, message: ConversationMessage): boolean {
    const convo = this.get(id)
    const historyIndex = this.history.findIndex((convo) => convo.id === id)

    if (!convo) {
      return false
    }

    if (convo && historyIndex === -1) {
      this.history.push(convo)
      return true
    }

    convo.messages.set(message.id, message)
    // Already at the top of the history
    if (historyIndex === 0) {
      return true
    }

    this.history.splice(historyIndex, 1)
    this.history.push(convo)

    return true
  }

  public add(conversation: Conversation) {
    this.history.push(conversation)
    this.set(conversation.id, conversation)

    return this
  }

  public remove(conversation: Conversation) {
    const convoIdx = this.history.findIndex((convo) => convo.id === conversation.id)
    this.history.splice(convoIdx, 1)
    this.delete(conversation.id)

    return this
  }

  public batchAdd(conversations: Conversation[]) {
    conversations.forEach((conversation) => this.add(conversation))
    return this
  }
}
