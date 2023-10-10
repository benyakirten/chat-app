import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUsersStore()

  const state = ref<Promise<boolean> | null>(null)
  const silentLoginHasFailed = ref(false)

  async function startAuthStatePromise(): Promise<boolean> {
    if (state.value) {
      return state.value
    }

    const silentLogin = await useFetch('/auth/silent', { method: 'POST' })
    if (silentLogin.error.value) {
      silentLoginHasFailed.value = true
      return false
    }

    userStore.processAuthData(silentLogin.data.value)
    state.value = null
    return true
  }

  return { state, silentLoginHasFailed, startAuthStatePromise }
})
