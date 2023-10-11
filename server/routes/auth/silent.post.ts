import axios from 'axios'

import { getRefreshCookie } from '@/server/utils/cookies'
import { COMPLETE_AUTH_SHAPE } from '@/utils/shapes'
import { setAuthData } from '@/server/utils/account'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const refreshCookie = getRefreshCookie(event, config)
  if (!refreshCookie || !refreshCookie.rememberMe) {
    // TODO: Find the appropriate header for this:
    // No remember me cookie/don't remember me - no login
    setResponseStatus(event, 406)
    return { error: { message: 'Cookie unavailable' } }
  }
  const { rememberMe, refreshToken } = refreshCookie
  const result = await axios.post('/auth/refresh', {
    token: refreshToken,
  })

  if (result.status >= 400) {
    setResponseStatus(event, result.status)
    return result.data
  }

  const dataRes = COMPLETE_AUTH_SHAPE.safeParse(result.data)
  if (!dataRes.success) {
    setResponseStatus(event, 500)
    return { error: { message: 'Data shape unexpected' } }
  }

  return setAuthData(event, dataRes.data, rememberMe)
})
