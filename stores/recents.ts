import { defineStore } from 'pinia'

import { LRU } from '@/lib/recents'

export const useRecentsStore = defineStore('recents', () => {
  const allLRU = new LRU(10)
  const chatLRU = new LRU(3)

  return { allLRU, chatLRU }
})
