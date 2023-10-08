export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUsersStore()
  const backendUrl = process.env['BACKEND_URL']
  if (to.path.includes('/login') || !userStore.me || !backendUrl) {
    return
  }
  const path = to.path
  const recentsStore = useRecentsStore()
  if (to.path.includes('chat') && to.params['id']) {
    recentsStore.chatLRU.visit(path)
  }

  recentsStore.allLRU.visit(path)
  useFetch(`${backendUrl}/api/recents`, {
    method: 'POST',
    body: { recents: recentsStore.allLRU.cache, token: userStore.me.token, id: userStore.me.id },
  })
})
