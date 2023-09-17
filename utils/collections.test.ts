import { describe, expect, it, beforeEach } from 'vitest'

import { ConversationMap, arrayify, getFirstSetItem } from './collections'

describe('arrayify', () => {
  it('should return the item unchanged if the argument is already an array', () => {
    const arg = [{ foo: 'bar' }]
    const got = arrayify(arg)
    expect(got).toBe(arg)
  })

  it('should return the argument wrapped in an array if it s not already an array', () => {
    const got = arrayify({ foo: 'bar' })
    expect(got).toEqual([{ foo: 'bar' }])
  })
})

describe('getFirstSetItem', () => {
  it('should return undefined if the set is empty', () => {
    const got = getFirstSetItem(new Set())
    expect(got).toBeUndefined()
  })

  it('should return the first item in the set otherwise', () => {
    const set = new Set<string>()
    set.add('first')
    set.add('second')
    set.add('third')

    const got = getFirstSetItem(set)
    expect(got).toEqual('first')
  })
})

describe('ConversationMap', () => {
  let map: ConversationMap
  const conversation: Conversation = {
    id: 'c1',
    members: new Map(),
    messages: new Map(),
    isPrivate: false,
  }
  const conversation2: Conversation = {
    id: 'c2',
    members: new Map(),
    messages: new Map(),
    isPrivate: true,
  }
  const conversation3: Conversation = {
    id: 'c3',
    members: new Map(),
    messages: new Map(),
    isPrivate: false,
  }

  beforeEach(() => {
    map = new ConversationMap()
  })

  describe('add', () => {
    it('should add the item to top item in the map', () => {
      expect(map.length).toEqual(0)

      map.add(conversation)

      expect(map.length).toEqual(1)

      const iter = map[Symbol.iterator]()
      expect(iter.next().value).toEqual(conversation)
      expect(map.get('c1')).toEqual(conversation)
    })

    it('should add each new item as the most recent item', () => {
      map.add(conversation)
      map.add(conversation2)

      expect(map.length).toEqual(2)

      const iter = map[Symbol.iterator]()
      expect(iter.next().value).toEqual(conversation2)
      expect(iter.next().value).toEqual(conversation)
    })

    it('should move a conversation to the top of the history and overwrite the existing conversation fi ti already exists in the map', () => {
      map.add(conversation)
      map.add(conversation2)
      map.add({ ...conversation, isPrivate: true })

      const iter = map[Symbol.iterator]()
      expect(iter.next().value).toEqual({ ...conversation, isPrivate: true })
      expect(map.get('c1')).toEqual({ ...conversation, isPrivate: true })

      expect(iter.next().value).toEqual(conversation2)
    })
  })

  describe('batchAdd', () => {
    it('should add a series of items with the last item received to being the most recent item in the cache', () => {
      map.batchAdd([conversation, conversation2])

      expect(map.length).toEqual(2)

      expect(map.get('c1')).toEqual(conversation)
      expect(map.get('c2')).toEqual(conversation2)

      const iter = map[Symbol.iterator]()
      expect(iter.next().value).toEqual(conversation2)
      expect(iter.next().value).toEqual(conversation)
    })
  })

  describe('iterator', () => {
    it('should be able to operate as an iterator over the conversation items added to it', () => {
      map.batchAdd([conversation, conversation2, conversation3])

      const items = [...map]
      expect(items).toEqual([conversation3, conversation2, conversation])
    })
  })

  describe('constructor', () => {
    it('should add all the items in the constructor in reverse order if an array is passed in', () => {
      const _map = new ConversationMap([conversation, conversation2])

      expect(_map.length).toEqual(2)

      expect(_map.get('c1')).toEqual(conversation)
      expect(_map.get('c2')).toEqual(conversation2)

      const iter = _map[Symbol.iterator]()
      expect(iter.next().value).toEqual(conversation2)
      expect(iter.next().value).toEqual(conversation)
    })

    it('should add no conversations if no conversation was passed to the constructor', () => {
      const _map = new ConversationMap()
      expect(_map.length).toEqual(0)
      expect([...map]).toEqual([])
    })

    it('should add a single conversation if one was passed in instead of an array', () => {
      const _map = new ConversationMap(conversation)
      expect(_map.length).toEqual(1)
      expect([..._map]).toEqual([conversation])
    })
  })

  describe('addMessage', () => {
    it("should return false if the conversation doesn't exist in the map and not move the conversation to the top", () => {
      map.batchAdd([conversation, conversation2])

      const got = map.addMessage('c3', {
        sender: 'u1',
        content: 'message?',
        id: 'c3m1',
        status: 'complete',
        createTime: new Date(),
        updateTime: new Date(),
      })

      expect(got).toBe(false)
      expect(map.get('c3')).toBeUndefined()

      const iter = map[Symbol.iterator]()
      expect(iter.next().value).toEqual(conversation2)
      expect(iter.next().value).toEqual(conversation)
    })

    it('should add the message to the conversation and move the conversation to the top otherwise', () => {
      map.batchAdd([conversation, conversation2])

      const got = map.addMessage('c1', {
        sender: 'u1',
        content: 'message?',
        id: 'c1m1',
        status: 'complete',
        createTime: new Date(),
        updateTime: new Date(),
      })

      expect(got).toBe(true)
      const iter = map[Symbol.iterator]()
      expect(iter.next().value).toEqual(conversation)
      expect(iter.next().value).toEqual(conversation2)
    })
  })

  describe('remove', () => {
    it('should not alter the map and return false if the conversation with the id does not exist in the map', () => {
      map.batchAdd([conversation, conversation2, conversation3])
      const got = map.remove('c4')
      expect(got).toBe(false)

      expect([...map]).toEqual([conversation3, conversation2, conversation])
      expect(map.get('c1')).toEqual(conversation)
      expect(map.get('c2')).toEqual(conversation2)
      expect(map.get('c3')).toEqual(conversation3)
      expect(map.get('c4')).toBeUndefined()
    })

    it('should return true and remove the conversation from the map and return true if the conversation with the id exists in the map', () => {
      map.batchAdd([conversation, conversation2, conversation3])
      const got = map.remove('c2')
      expect(got).toBe(true)

      expect([...map]).toEqual([conversation3, conversation])
      expect(map.get('c2')).toBeUndefined()
    })
  })
})
