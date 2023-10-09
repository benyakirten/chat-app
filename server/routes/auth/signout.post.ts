import axios from 'axios'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const refreshToken = getRefreshCookie(event, config)

  deleteCookie(event, config.rememberMeCookieName)
  deleteCookie(event, config.refreshCookieName)

  const res = await axios.post('/auth/signout', { token: refreshToken })

  setResponseStatus(event, res.status)
  return res.data
})
