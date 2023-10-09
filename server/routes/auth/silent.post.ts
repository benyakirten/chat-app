import { getRememberMeCookie } from '@/server/utils/cookies'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rememberMeCookie = getRememberMeCookie(event, config)

  if (!rememberMeCookie) {
    // TODO: Find the appropriate header
    // No remember me cookie - no login
    setResponseStatus(event, 406)
    return
  }

  const { email, password } = rememberMeCookie
  return sendAuthRequest(event, 'login', { email, password, rememberMe: true })
})
