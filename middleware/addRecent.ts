import { useRecentsStore } from '@/stores/recents'

export default defineNuxtRouteMiddleware((to) => {
  const recentsStore = useRecentsStore()
  if (to.path.includes('chat') && to.params['id']) {
    recentsStore.chatLRU.visit(to.path)
  }
  recentsStore.allLRU.visit(to.path)
  // TODO: Store these values on the server
})
