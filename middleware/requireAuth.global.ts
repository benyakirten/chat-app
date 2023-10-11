import { doesNotNeedLogin } from '@/utils/auth'
import { useAuthStore } from '~/stores/auth'

/**
 * Since this involves setting cookies - we want to limit it to client
 * side only.
 * TODO: Investigate if server side is possible if we store the data until the client request comes in
 * We start with the following premise: the user has visited a route.
 * There are three possible option of what happens
 * 1. They are already logged in - stop, we don't care
 * 2. They are visiting a route that doesn't need auth (login, home)
 * 3. They are visiting a route that needs auth (account, chat)
 *
 * In situation 1, we exit early
 *
 * In situation 2, we perform the silent login in the background and store the promise.
 * If it succeeds, we populate the user and resolve to true
 * If it fails, we mark that the silent login has failed and resolve to false
 *
 * In situation 3, we need to check if silent login has failed
 * If it has, make the user go to the login page
 * If it hasn't, attempt silent login.
 * If silent login fails, make them go to the login page.
 * If it succeeds, let them proceed where they want to go.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // If we succeed in silently logging in, we want to
  // replace cookies - which requires client side interaction
  if (process.server) {
    return
  }

  const userStore = useUsersStore()
  const authStore = useAuthStore()
  // Situation 1
  if (userStore.me) {
    return
  }

  // Situation 2
  if (doesNotNeedLogin(to.path)) {
    authStore.startAuthStatePromise()
    return
  }

  // Situation 3
  if (authStore.silentLoginHasFailed) {
    return navigateTo('/login')
  }

  const loginSuccess = await authStore.startAuthStatePromise()
  if (!loginSuccess) {
    return navigateTo('/login')
  }
})
