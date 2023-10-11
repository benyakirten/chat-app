export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUsersStore()
  if (to.path.includes('/login') || !userStore.me) {
    return
  }

  const recentsStore = useRecentsStore()
  recentsStore.visit(to.path)

  useAuthedFetch('/api/recents', 'POST', { recents: recentsStore.allLRU.cache })
})
