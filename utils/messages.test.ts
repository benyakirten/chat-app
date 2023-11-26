import { describe, it, expect, test, vi } from 'vitest'

import { chunkMessagesByAuthor, getUserReadTimes, getMessageReadList } from './messages'

describe('chunkMessagesByAuthor', () => {
  const now = new Date('1980-1-1')
  const anotherTime = new Date('1990-1-1')
  test.each<{ want: ConversationMessage[][]; input: ConversationMessage[]; desc: string }>([
    {
      input: [],
      want: [],
      desc: 'an empty array if there are no messages',
    },
    {
      input: [
        {
          sender: 'u1',
          id: 'm1',
          content: 'Message1',
          status: 'complete',
          createTime: now,
          updateTime: anotherTime,
        },

        {
          sender: 'u1',
          id: 'm2',
          content: 'Message2',
          status: 'complete',
          createTime: anotherTime,
          updateTime: anotherTime,
        },

        {
          sender: 'u1',
          id: 'm3',
          content: 'Message3',
          status: 'complete',
          createTime: anotherTime,
          updateTime: now,
        },
      ],

      want: [
        [
          {
            sender: 'u1',
            id: 'm1',
            content: 'Message1',
            status: 'complete',
            createTime: now,
            updateTime: anotherTime,
          },
          {
            sender: 'u1',
            id: 'm2',
            content: 'Message2',
            status: 'complete',
            createTime: anotherTime,
            updateTime: anotherTime,
          },
          {
            sender: 'u1',
            id: 'm3',
            content: 'Message3',
            status: 'complete',
            createTime: anotherTime,
            updateTime: now,
          },
        ],
      ],
      desc: 'one list of inputs if there is only one author',
    },
    {
      input: [
        {
          sender: 'u1',
          id: 'm1',
          content: 'Message1',
          status: 'complete',
          createTime: now,
          updateTime: anotherTime,
        },

        {
          sender: 'u1',
          id: 'm2',
          content: 'Message2',
          status: 'complete',
          createTime: now,
          updateTime: anotherTime,
        },

        {
          sender: 'u2',
          id: 'm3',
          content: 'Message3',
          status: 'complete',
          createTime: anotherTime,
          updateTime: anotherTime,
        },

        {
          sender: 'u1',
          id: 'm4',
          content: 'Message4',
          status: 'complete',
          createTime: anotherTime,
          updateTime: now,
        },

        {
          sender: 'u3',
          id: 'm5',
          content: 'Message5',
          status: 'complete',
          createTime: anotherTime,
          updateTime: now,
        },
      ],
      want: [
        [
          {
            sender: 'u1',
            id: 'm1',
            content: 'Message1',
            status: 'complete',
            createTime: now,
            updateTime: anotherTime,
          },
          {
            sender: 'u1',
            id: 'm2',
            content: 'Message2',
            status: 'complete',
            createTime: now,
            updateTime: anotherTime,
          },
        ],
        [
          {
            sender: 'u2',
            id: 'm3',
            content: 'Message3',
            status: 'complete',
            createTime: anotherTime,
            updateTime: anotherTime,
          },
        ],
        [
          {
            sender: 'u1',
            id: 'm4',
            content: 'Message4',
            status: 'complete',
            createTime: anotherTime,
            updateTime: now,
          },
        ],
        [
          {
            sender: 'u3',
            id: 'm5',
            content: 'Message5',
            status: 'complete',
            createTime: anotherTime,
            updateTime: now,
          },
        ],
      ],
      desc: 'the lists of messages correctly separated by author',
    },
  ])('should return $desc', ({ desc, want, input }) => {
    // Bun problem: https://github.com/oven-sh/bun/issues/5631
    const got = chunkMessagesByAuthor(input)
    expect(got).toEqual(want)
  })
})

describe('getUserReadTimes', () => {
  it('should return a table of the user names to their last read time for all users other than the author', () => {
    const conversation: Conversation = {
      id: 'c1',
      members: new Map(),
      messages: new Map(),
      isPrivate: false,
      alias: null,
    }

    const _1980 = new Date('1980-1-1')
    const _1990 = new Date('1990-1-1')
    const _2000 = new Date('2000-1-1')
    conversation.members.set('u1', {
      lastRead: _1980,
      state: 'idle',
    })
    conversation.members.set('u2', {
      lastRead: _1990,
      state: 'idle',
    })
    conversation.members.set('u3', {
      lastRead: _2000,
      state: 'idle',
    })

    const result = getUserReadTimes(conversation, 'u2')
    expect(result).toEqual({
      u1: _1980,
      u3: _2000,
    })
  })
})

describe('getMessageReadList', () => {
  it("should return a list of all users who have a read time after the message's create time", () => {
    const users: Map<UserId, User> = new Map()
    users.set('u1', {
      id: 'u1',
      name: 'User 1',
      online: false,
    })
    users.set('u2', {
      id: 'u2',
      name: 'User 2',
      online: false,
    })
    users.set('u3', {
      id: 'u3',
      name: 'User 3',
      online: false,
    })

    const _1980 = new Date('1980-1-1')
    const _1985 = new Date('1985-1-1')
    const _1990 = new Date('1990-1-1')
    const _2000 = new Date('2000-1-1')

    const readTimes = {
      u1: _1980,
      u2: _1990,
      u3: _2000,
    }

    // This test will fail in bun test since `Date.prototype.valueOf` is not implemented
    const got = getMessageReadList(_1985, users, readTimes)
    expect(got).toEqual(['User 2', 'User 3'])
  })
})
