export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUsersStore()
  if (to.path.includes('/login') || !userStore.me) {
    return
  }

  const recentsStore = useRecentsStore()
  recentsStore.visit(to.path)

  useFetch('/api/recents', {
    method: 'POST',
    body: { recents: recentsStore.allLRU.cache, id: userStore.me.id },
  })
})
