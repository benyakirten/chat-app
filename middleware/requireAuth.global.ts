import { doesNotNeedLogin } from '@/utils/auth'

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUsersStore()
  if (userStore.me || doesNotNeedLogin(to.path)) {
    return
  }

  // TODO:
  // NOTE: because it's an http only token, this will need to be
  // a post request to the backend - Maybe we should do this in a component?
  // 1. Check if the refresh token is present - if so use it
  // 2. If false for either reason, check the remember me cookie for login/pass
  //    if present, attempt to use thpse
  // 3. If both are false, redirect to the login page for manual logging in

  // return navigateTo('/login')
})
