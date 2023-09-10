class Node<T> {
  constructor(public value: T, public prev?: Node<T>, public next?: Node<T>) {}
}

class BetterLRU<K, V> {
  private length: number = 0
  private head?: Node<V> = undefined
  private tail?: Node<V> = undefined

  private lookup: Map<K, Node<V>> = new Map()
  private reverseLookup: Map<Node<V>, K> = new Map()

  constructor(private capacity: number = 10) {}

  update(key: K, value: V): void {
    let node = this.lookup.get(key)
    if (!node) {
      node = new Node(value)
      this.length++
      this.prepend(node)
      this.trimCache()

      this.lookup.set(key, node)
      this.reverseLookup.set(node, key)

      return
    }

    this.detach(node)
    this.prepend(node)
    node.value = value
  }

  get(key: K): V | undefined {
    const node = this.lookup.get(key)
    if (!node) {
      return
    }

    this.detach(node)
    this.prepend(node)

    return node.value
  }

  /**
   * Remove a node from the DLL
   */
  private detach(node: Node<V>): void {
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

  private prepend(node: Node<V>): void {
    if (!this.head) {
      this.head = this.tail = node
      return
    }

    node.next = this.head
    this.head.prev = node
    this.head = node
  }

  private trimCache(): void {
    if (this.length <= this.capacity || !this.tail) {
      return
    }

    const tail = this.tail
    this.detach(this.tail)

    const key = this.reverseLookup.get(tail) as K
    this.lookup.delete(key)
    this.reverseLookup.delete(tail)
    this.length--
  }
}

/**
 * Create a LRU cache that will display the most recently used items
 * This will be useful for the recently viewed page and for the most recent chats.
 *
 * The uses a Set<string> instead of using a map + doubly linked list for expedience
 * in creating it - with the cost of getting the cache being O(n)
 *
 * TODO: Consider if this should be on the backend - however this allows for
 * it to be easily updated by sockets using vue reactive properties and
 * optimistic updates. But it comes with the possibility of desynchronization
 */
export class LRU {
  // We are using a set instead of a map so that we can dynamically update
  // the page title if need be
  // i.e. Chat with 3 people becomes Chat with 4 people if someone joins
  private _cache: Set<string> = new Set()
  public get cache() {
    return [...this._cache.values()].reverse()
  }

  /**
   * Remove N oldest items from the LRU cache
   */
  private remove(n: number) {
    for (let i = 0; i < n; i++) {
      const iter = this._cache.keys().next()
      if (iter.done) {
        break
      }
      this._cache.delete(iter.value)
    }
  }

  constructor(private _size = 10) {}

  public get size() {
    return this._size
  }

  public set size(newSize: number) {
    if (newSize < 1) {
      newSize = 1
    }

    if (newSize < this._size) {
      this.remove(this._size - newSize)
    }
    this._size = newSize
  }

  public visit(page: string) {
    if (this._cache.has(page)) {
      this._cache.delete(page)
      this._cache.add(page)
      return
    }

    if (this._cache.size >= this._size) {
      this.remove(1)
    }

    this._cache.add(page)
  }
}
