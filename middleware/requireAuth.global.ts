import { doesNotNeedLogin } from '@/utils/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) {
    return
  }

  const userStore = useUsersStore()
  if (userStore.me) {
    if (to.path === '/login') {
      return navigateTo('/chat')
    }

    return
  }

  const silentLogin = await useFetch('/auth/silent', { method: 'POST' })
  if (silentLogin.error.value) {
    if (doesNotNeedLogin(to.path)) {
      return
    }
    return navigateTo('/login')
  }

  userStore.processAuthData(silentLogin.data.value)
  if (doesNotNeedLogin(to.path)) {
    return
  }

  await navigateTo('/chat')
})
