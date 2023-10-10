import axios from 'axios'

import { getRefreshCookie } from '@/server/utils/cookies'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const refreshCookie = getRefreshCookie(event, config)

  deleteCookie(event, config.cookieName)

  if (refreshCookie) [axios.post('/auth/signout', { token: refreshCookie.refreshToken })]

  await sendRedirect(event, '/login')
})
