import { describe, expect, it, beforeEach } from 'vitest'

import { arrayify, getFirstSetItem, ConversationMap, ConversationMap2 } from './collections'

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
  let map: ConversationMap2
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

  beforeEach(() => {
    map = new ConversationMap2()
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
      //
    })
  })

  describe('constructor', () => {
    it('should add the items into the conversation and add the history', () => {
      // TODO
    })
  })

  describe('addMessage', () => {
    it("should return false if the conversation doesn't exist in the map", () => {
      // TODO
    })

    it('should add the message to the conversation and move the conversation to the top otherwise', () => {
      // TODO
    })
  })

  describe('remove', () => {
    it('should remove the conversation from the history and the map', () => {
      // TODO
    })
  })
})
