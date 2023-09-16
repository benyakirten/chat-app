export const arrayify = <T>(item: T | T[]) => (Array.isArray(item) ? item : [item])
export const getFirstSetItem = <T>(set: Set<T>): T | undefined => set.keys().next().value

/**
 * This is a combination of a map and a stack ecause it is more efficient to look up an
 * individual conversation for reference, but at the same time we want to be able to
 * manually reorder the items in the map. Is this better than just a stack we reorder?
 * We might be consuming more memory unnecessarily. I use an array instead of custom stack
 * because a JavaScript array is better than a linked list - CF https://www.youtube.com/watch?v=YQs6IC-vgmo
 *
 * Should this be replaced with a LRU cache with no size limit?
 */
export class ConversationMap extends Map<ConversationId, Conversation> {
  public history: Conversation[] = []

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
    this.moveConvoToTopOfHistory(convo)

    return true
  }

  /**
   * General purpose method that will make sure a conversation is moved to the top of the history.
   * Caveat emptor: this assumes that its position in the map has already been done correctly.
   */
  private moveConvoToTopOfHistory(conversation: Conversation) {
    const historyIndex = this.history.findIndex((convo) => convo.id === conversation.id)

    // Already at the top of the history
    if (historyIndex === 0) {
      return
    }

    // If it's -1, .splice removes the last element
    if (historyIndex !== -1) {
      this.history.splice(historyIndex, 1)
    }
    this.history.unshift(conversation)
  }

  /**
   * Add the conversation to the map and history.
   * If the conversation already exists then it will
   * bump it into top item on the history.
   * NOTE: This will overwrite the conversation in the map if it already exists.
   */
  public add(conversation: Conversation) {
    this.set(conversation.id, conversation)
    this.moveConvoToTopOfHistory(conversation)

    return this
  }

  /**
   * Remove a conversation from the map and the history.
   */
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

class ConversationNode {
  constructor(public value: Conversation, public prev?: ConversationNode, public next?: ConversationNode) {}
}

export class ConversationMap2 {
  public length: number = 0

  private head?: ConversationNode = undefined
  private tail?: ConversationNode = undefined
  private lookup: Map<ConversationId, ConversationNode> = new Map()

  constructor(conversations: Conversation | Conversation[] = []) {
    this.batchAdd(arrayify(conversations))
  }

  public [Symbol.iterator]() {
    let node = this.head
    return {
      next() {
        if (node) {
          const convo = node.value
          node = node.next
          return {
            value: convo,
            done: false,
          }
        }

        return {
          value: undefined,
          done: true,
        }
      },
    }
  }

  public get(id: ConversationId) {
    return this.lookup.get(id)?.value
  }

  public add(conversation: Conversation): ConversationMap2 {
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
