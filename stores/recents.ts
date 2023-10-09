import { defineStore } from 'pinia'

const CHAT_ID_REGEX = /chat\/([a-zA-Z0-9-]+)/
export const useRecentsStore = defineStore('recents', () => {
  const allLRU = new LRU(20)
  const chatLRU = new LRU(3)

  function reset() {
    allLRU.reset()
    chatLRU.reset()
  }

  function visit(path: string) {
    if (path.match(CHAT_ID_REGEX)) {
      chatLRU.visit(path)
    }

    allLRU.visit(path)
  }

  return { allLRU, chatLRU, reset, visit }
})
