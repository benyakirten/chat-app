import { describe, expect, it, beforeEach } from 'vitest'

import { arrayify, getFirstSetItem, ConversationMap } from './collections'

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

  beforeEach(() => {
    map = new ConversationMap()
  })

  describe('add', () => {
    it('should add the item to the map and the history', () => {
      expect(map.size).toEqual(0)
      expect(map.history.length).toEqual(0)

      map.add(conversation)

      expect(map.size).toEqual(1)
      expect(map.history.length).toEqual(1)

      expect(map.get('c1')).toEqual(conversation)
      expect(map.history[0]).toEqual(conversation)
    })

    it('should add each new item as the most recent item in the map', () => {
      map.add(conversation)
      map.add(conversation2)

      expect(map.size).toEqual(2)
      expect(map.history.length).toEqual(2)

      expect(map.history[0]).toEqual(conversation2)
      expect(map.history[1]).toEqual(conversation)
    })

    it('should move a conversation to the top of the history and overwrite the existing conversation if it already exists in the map', () => {
      map.add(conversation)
      map.add(conversation2)
      map.add({ ...conversation, isPrivate: true })

      expect(map.get('c1')).toEqual({ ...conversation, isPrivate: true })
      expect(map.history.length).toEqual(2)

      expect(map.history[0]).toEqual({ ...conversation, isPrivate: true })
      expect(map.history[1]).toEqual(conversation2)
    })
  })

  describe('batchAdd', () => {
    it('should add a series of items with the last item received to being the most recent item in the map', () => {
      map.batchAdd([conversation, conversation2])

      expect(map.size).toEqual(2)

      expect(map.get('c1')).toEqual(conversation)
      expect(map.get('c2')).toEqual(conversation2)

      expect(map.history.length).toEqual(2)
      expect(map.history[0]).toEqual(conversation2)
      expect(map.history[1]).toEqual(conversation)
    })
  })

  describe('constructor', () => {
    it('should add the items into the conversation and add the history', () => {
      const _map = new ConversationMap([conversation, conversation2])

      expect(_map.size).toEqual(2)

      expect(_map.get('c1')).toEqual(conversation)
      expect(_map.get('c2')).toEqual(conversation2)

      expect(_map.history.length).toEqual(2)
      expect(_map.history[0]).toEqual(conversation2)
      expect(_map.history[1]).toEqual(conversation)
    })

    it('should have an empty size if no conversations were passed into the constructor', () => {
      const _map = new ConversationMap()
      expect(_map.size).toEqual(0)
      expect(_map.history.length).toEqual(0)
    })

    it('should be appropriately be able to add a single conversation', () => {
      const _map = new ConversationMap(conversation)
      expect(_map.size).toEqual(1)
      expect(_map.get('c1')).toEqual(conversation)

      expect(_map.history.length).toEqual(1)
      expect(_map.history[0]).toEqual(conversation)
    })
  })

  describe('addMessage', () => {
    const m1: ConversationMessage = {
      id: 'm1',
      sender: 'u1',
      content: 'Hi!',
      status: 'complete',
      createTime: new Date(),
      updateTime: new Date(),
    }
    it("should return false if the conversation doesn't exist in the map and not update the map/history", () => {
      const got = map.addMessage('c1', m1)
      expect(got).toBe(false)
      expect(map.size).toEqual(0)
      expect(map.history.length).toEqual(0)
    })

    it('should add the message to the conversation and move the conversation as the first item in the map otherwise', () => {
      map.batchAdd([conversation, conversation2])

      const got = map.addMessage('c1', m1)
      expect(got).toBe(true)

      expect(map.history.length).toEqual(2)
      expect(map.history[0].id).toEqual('c1')
      expect(map.history[0].messages.size).toEqual(1)
      expect(map.history[0].messages.entries().next().value).toEqual(['m1', m1])
      expect(map.history[1].id).toEqual('c2')
    })
  })

  describe('remove', () => {
    const conversation3: Conversation = {
      id: 'c3',
      members: new Map(),
      messages: new Map(),
      isPrivate: true,
    }

    it('should remove the conversation from the history and the map if the item exists', () => {
      map.batchAdd([conversation, conversation2, conversation3])
      map.remove('c3')

      expect(map.size).toEqual(2)
      expect(map.get('c1')).toEqual(conversation)
      expect(map.get('c2')).toEqual(conversation2)
      expect(map.get('c3')).toBeUndefined()

      expect(map.history.length).toEqual(2)
      expect(map.history[0]).toEqual(conversation2)
      expect(map.history[1]).toEqual(conversation)
    })

    it('should not reduce the size or affect the conversation ordering if the item does not exist', () => {
      map.batchAdd([conversation, conversation2, conversation3])
      map.remove('c4')

      expect(map.size).toEqual(3)
      expect(map.get('c1')).toEqual(conversation)
      expect(map.get('c2')).toEqual(conversation2)
      expect(map.get('c3')).toEqual(conversation3)

      expect(map.history.length).toEqual(3)
      expect(map.history[0]).toEqual(conversation3)
      expect(map.history[1]).toEqual(conversation2)
      expect(map.history[2]).toEqual(conversation)
    })
  })
})
