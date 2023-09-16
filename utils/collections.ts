export const arrayify = <T>(item: T | T[]) => (Array.isArray(item) ? item : [item])
export const getFirstSetItem = <T>(set: Set<T>): T | undefined => set.keys().next().value

/**
 * ConversationMap2 performs all things as required but cannot be marshalled/unmarshalled by flatten
 * which nuxt uses to handle values - therefore we are using something much more like what is used in the LRU
 */
export class ConversationMap extends Map<ConversationId, Conversation> {
  private _history: Conversation[] = []
  public get history() {
    return [...this._history].reverse()
  }

  constructor(conversations: Conversation | Conversation[] = []) {
    super()
    this.batchAdd(arrayify(conversations))
  }

  public addMessage(id: ConversationId, message: ConversationMessage): boolean {
    const convo = this.get(id)
    if (!convo) {
      return false
    }

    convo.messages.set(message.id, message)
    this.moveToTop(convo)

    return true
  }

  private moveToTop(conversation: Conversation) {
    const historyIndex = this._history.findIndex((convo) => convo.id === conversation.id)

    if (this.history.length > 1 && historyIndex === this.history.length - 1) {
      return
    }

    if (historyIndex !== -1) {
      this._history.splice(historyIndex, 1)
    }

    this._history.push(conversation)
  }

  public add(conversation: Conversation) {
    this.set(conversation.id, conversation)
    this.moveToTop(conversation)

    return this
  }

  public remove(id: ConversationId) {
    const convoIdx = this._history.findIndex((convo) => convo.id === id)
    if (convoIdx === -1) {
      return
    }

    this._history.splice(convoIdx, 1)
    this.delete(id)

    return this
  }

  public batchAdd(conversations: Conversation[]) {
    conversations.forEach((conversation) => this.add(conversation))
    return this
  }
}

class ConversationNode {
  constructor(public value: Conversation, public prev?: ConversationNode, public next?: ConversationNode) {}
}

/**
 * Modeled off a LRU cache, this does not have a size limit and has some customized functions
 */
export class ConversationMap2 {
  public length: number = 0

  private head?: ConversationNode = undefined
  private tail?: ConversationNode = undefined
  public lookup: Map<ConversationId, ConversationNode> = new Map()

  constructor(conversations: Conversation | Conversation[] = []) {
    this.batchAdd(arrayify(conversations))
  }

  public *[Symbol.iterator]() {
    let node = this.head
    while (node) {
      yield node.value
      node = node.next
    }
  }

  public get(id: ConversationId) {
    return this.lookup.get(id)?.value
  }

  public add(conversation: Conversation) {
    let node = this.lookup.get(conversation.id)
    if (!node) {
      node = new ConversationNode(conversation)
      this.length++
      this.prepend(node)

      this.lookup.set(conversation.id, node)

      return this
    }

    this.raise(node)
    node.value = conversation

    return this
  }

  public addMessage(id: ConversationId, message: ConversationMessage): boolean {
    const node = this.lookup.get(id)

    if (!node) {
      return false
    }

    node.value.messages.set(message.id, message)
    this.raise(node)

    return true
  }

  public batchAdd(conversations: Conversation[]) {
    conversations.forEach((convo) => this.add(convo))

    return this
  }

  public remove(id: ConversationId): boolean {
    const node = this.lookup.get(id)
    if (!node) {
      return false
    }

    this.length--
    this.detach(node)
    this.lookup.delete(id)

    return true
  }

  private raise(node: ConversationNode) {
    this.detach(node)
    this.prepend(node)
  }

  /**
   * Remove a node from the linked list
   */
  private detach(node: ConversationNode): void {
    const { next, prev } = node
    if (prev) {
      prev.next = next
    }

    if (next) {
      next.prev = prev
    }

    /**
     * If we are removing the head, we need to move the head over to point at the next node
     */
    if (this.head === node) {
      this.head = this.head.next
    }

    /**
     * If we are removing the tail then our tail now needs to point to the item previous to ur node
     */
    if (this.tail === node) {
      this.tail = this.tail.prev
    }

    /**
     * Remove all connections
     */
    node.next = undefined
    node.prev = undefined
  }

  private prepend(node: ConversationNode): void {
    if (!this.head) {
      this.head = this.tail = node
      return
    }

    node.next = this.head
    this.head.prev = node
    this.head = node
  }
}
