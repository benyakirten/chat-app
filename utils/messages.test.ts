import { describe, it, expect, test } from 'vitest'

import { chunkMessagesByAuthor } from './messages'

describe('chunkMessagesByAuthor', () => {
  const now = new Date('1980-1-1')
  const anotherTime = new Date('1990-1-1')
  test.each<{ want: ConversationMessage[][]; input: Map<MessageId, ConversationMessage>; desc: string }>([
    {
      input: new Map(),
      want: [],
      desc: 'an empty array if there are no messages',
    },
    {
      input: new Map([
        [
          'm1',
          {
            sender: 'u1',
            id: 'm1',
            content: 'Message1',
            status: 'complete',
            createTime: now,
            updateTime: anotherTime,
          },
        ],
        [
          'm2',
          {
            sender: 'u1',
            id: 'm2',
            content: 'Message2',
            status: 'complete',
            createTime: anotherTime,
            updateTime: anotherTime,
          },
        ],
        [
          'm3',
          {
            sender: 'u1',
            id: 'm3',
            content: 'Message3',
            status: 'complete',
            createTime: anotherTime,
            updateTime: now,
          },
        ],
      ]),
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
      input: new Map([
        [
          'm1',
          {
            sender: 'u1',
            id: 'm1',
            content: 'Message1',
            status: 'complete',
            createTime: now,
            updateTime: anotherTime,
          },
        ],
        [
          'm2',
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
          'm3',
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
          'm4',
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
          'm5',
          {
            sender: 'u3',
            id: 'm5',
            content: 'Message5',
            status: 'complete',
            createTime: anotherTime,
            updateTime: now,
          },
        ],
      ]),
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
  ])('should return ^^ ($desc)', ({ desc, want, input }) => {
    // Bun problem: https://github.com/oven-sh/bun/issues/5631
    console.log(desc)
    const got = chunkMessagesByAuthor(input)
    expect(got).toEqual(want)
  })
})

describe('getUserReadTimes', () => {
  it('should return a table of the user names to their last read time for all users other than the author', () => {
    // TODO
  })
})

describe('getMessageReadList', () => {
  it("should return a list of all users who have a read time after the message's create time", () => {
    // TODO
  })
})
