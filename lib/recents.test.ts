import { beforeEach, describe, expect, it } from 'vitest'

import { LRU } from './recents'

describe('LRU Cache', () => {
  let lru: LRU

  beforeEach(() => {
    lru = new LRU(3)
  })

  describe('visit', () => {
    it('should add an item to the cache if it does not already exist', () => {
      lru.visit('me')
      const cacheResults = lru.cache
      expect(cacheResults[0]).toEqual('me')
    })

    it('should add an item to the cache in reverse order of when they were added', () => {
      lru.visit('me')
      lru.visit('you')
      const cacheResults = lru.cache
      expect(cacheResults[0]).toEqual('you')
      expect(cacheResults[1]).toEqual('me')
    })

    it('should move an item to the top result and not add a new entry if it is already in the cache and is visited again', () => {
      lru.visit('me')
      lru.visit('you')
      lru.visit('them')

      let cacheResults = lru.cache

      expect(cacheResults[0]).toEqual('them')
      expect(cacheResults[1]).toEqual('you')
      expect(cacheResults[2]).toEqual('me')

      lru.visit('me')

      cacheResults = lru.cache

      expect(cacheResults[0]).toEqual('me')
      expect(cacheResults[1]).toEqual('them')
      expect(cacheResults[2]).toEqual('you')
    })

    it('should remove the oldest item in the cache if the size limit has been reached', () => {
      lru.visit('me')
      lru.visit('you')
      lru.visit('them')

      let cacheResults = lru.cache

      expect(cacheResults[0]).toEqual('them')
      expect(cacheResults[1]).toEqual('you')
      expect(cacheResults[2]).toEqual('me')

      lru.visit('us')
      cacheResults = lru.cache
      expect(cacheResults[0]).toEqual('us')
      expect(cacheResults[1]).toEqual('them')
      expect(cacheResults[2]).toEqual('you')
    })

    it('should accurately remove the last N entries if the size has been reduced by N', () => {
      lru.visit('me')
      lru.visit('you')
      lru.visit('them')

      let cache = lru.cache
      expect(cache.length).toEqual(3)

      lru.size = 2
      cache = lru.cache

      expect(cache.length).toEqual(2)
      expect(cache[0]).toEqual('them')
      expect(cache[1]).toEqual('you')
    })

    it('should be able to increase the size of the cache', () => {
      lru.visit('me')
      lru.visit('you')
      lru.visit('them')
      lru.visit('us')

      let cache = lru.cache
      expect(cache.length).toEqual(3)
      expect(cache).toEqual(['us', 'them', 'you'])

      lru.size = 4
      lru.visit('me')

      cache = lru.cache
      expect(cache.length).toEqual(4)
      expect(cache).toEqual(['me', 'us', 'them', 'you'])
    })

    it('should maintain accuracy with repeated operations over many iterations', () => {
      const tests: { toVisit: string; expected: string[] }[] = [
        {
          toVisit: 'page1',
          expected: ['page1'],
        },
        {
          toVisit: 'page2',
          expected: ['page2', 'page1'],
        },
        {
          toVisit: 'page1',
          expected: ['page1', 'page2'],
        },
        {
          toVisit: 'page3',
          expected: ['page3', 'page1', 'page2'],
        },
        {
          toVisit: 'page4',
          expected: ['page4', 'page3', 'page1'],
        },
        {
          toVisit: 'page3',
          expected: ['page3', 'page4', 'page1'],
        },
        {
          toVisit: 'page1',
          expected: ['page1', 'page3', 'page4'],
        },
        {
          toVisit: 'page2',
          expected: ['page2', 'page1', 'page3'],
        },
      ]

      for (const { toVisit, expected } of tests) {
        lru.visit(toVisit)
        expect(lru.cache).toEqual(expected)
      }
    })
  })
})
