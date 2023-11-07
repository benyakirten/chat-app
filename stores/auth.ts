import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUsersStore()

  const state = ref<Promise<boolean> | null>(null)
  const silentLoginHasFailed = ref(false)

  async function startAuthStatePromise(): Promise<boolean> {
    if (silentLoginHasFailed.value) {
      return false
    }

    if (state.value) {
      return state.value
    }

    state.value = useFetch('/auth/silent', { method: 'POST' }).then((silentLogin) => {
      if (silentLogin.error.value) {
        silentLoginHasFailed.value = true
        return false
      }

      userStore.processAuthData(silentLogin.data.value)
      state.value = null
      return true
    })

    return state.value
  }

  return { state, silentLoginHasFailed, startAuthStatePromise }
})
