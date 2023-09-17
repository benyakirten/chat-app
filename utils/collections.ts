export const arrayify = <T>(item: T | T[]) => (Array.isArray(item) ? item : [item])
export const getFirstSetItem = <T>(set: Set<T>): T | undefined => set.keys().next().value

// This may work when we no longer provide default state
interface ConversationNode {
  value: Conversation
  next?: ConversationNode
  prev?: ConversationNode
}

/**
 * Modified LRU cache for more efficient lookup and reordering of a conversation map
 * Uses a map for lookups and doubly linked list for the order
 * One thing ot keep in mind: a DLL might be more inefficient than an array
 * because the values are not stored sequentially, CF https://www.youtube.com/watch?v=YQs6IC-vgmo
 */
export class ConversationMap {
  public length: number = 0

  private head?: ConversationNode = undefined
  private tail?: ConversationNode = undefined
  private lookup: Map<ConversationId, ConversationNode> = new Map()

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

  public add(conversation: Conversation): ConversationMap {
    let node = this.lookup.get(conversation.id)
    if (!node) {
      node = { value: conversation }
      this.length++
      this.prepend(node)

      this.lookup.set(conversation.id, node)

      return this
    }

    this.raise(node)
    node.value = conversation

    return this
  }

  public addMessage(conversationId: ConversationId, message: ConversationMessage): boolean {
    const node = this.lookup.get(conversationId)

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
