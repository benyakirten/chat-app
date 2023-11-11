import axios from 'axios'

import { getRefreshCookie } from '@/server/utils/cookies'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const refreshCookie = getRefreshCookie(event, config)

  deleteCookie(event, config.authCookieName)
  if (refreshCookie) {
    await axios.post('/api/signout', { token: refreshCookie.refreshToken })
  }
})
