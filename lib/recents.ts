/**
 * Create a LRU cache that will display the most recently used items
 * This will be useful for the recently viewed page and for the most recent chats
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
  // TODO: Consider how to reverse the entries in less than O(n)
  public get cache() {
    return [...this._cache.values()].reverse()
  }

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
