import { doesNotNeedLogin } from '@/utils/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUsersStore()
  if (userStore.me || doesNotNeedLogin(to.path)) {
    return
  }

  const silentLogin = await useFetch('/auth/silent', { method: 'POST' })
  if (silentLogin.error.value) {
    return navigateTo('/login')
  }
})
