import axios from 'axios'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const refreshToken = getRefreshCookie(event, config)

  deleteCookie(event, config.rememberMeCookieName)
  deleteCookie(event, config.refreshCookieName)

  await axios.post('/auth/signout', { token: refreshToken })

  await sendRedirect(event, '/login')
})
