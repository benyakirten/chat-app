import { defineStore, skipHydrate } from 'pinia'

export const useMediaStore = defineStore('media', () => {
  const conversationListOpen = ref(false)

  const mobileMq = globalThis.matchMedia?.('(max-width: 800px)')
  const state = ref<'desktop' | 'mobile'>(mobileMq?.matches ? 'mobile' : 'desktop')
  mobileMq?.addEventListener('change', (e) => {
    state.value = e.matches ? 'mobile' : 'desktop'
  })

  return { state: skipHydrate(state), conversationListOpen }
})
