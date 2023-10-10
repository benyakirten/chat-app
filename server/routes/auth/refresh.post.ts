import axios from 'axios'

import { getRefreshCookie, setRefreshCookie } from '@/server/utils/cookies'
import { setAuthToken } from '@/server/utils/axios'
import { COMPLETE_AUTH_SHAPE } from '@/utils/shapes'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const refreshCookie = getRefreshCookie(event, config)

  if (!refreshCookie) {
    setResponseStatus(event, 406)
    return { error: { message: 'Refresh token not stored' } }
  }

  const { refreshToken, rememberMe } = refreshCookie
  const result = await axios.post('/auth/refresh', {
    token: refreshToken,
  })

  if (result.status > 400) {
    setResponseStatus(event, result.status)
    return result.data
  }

  const dataRes = COMPLETE_AUTH_SHAPE.safeParse(result.data)
  if (!dataRes.success) {
    setResponseStatus(event, 500)
    return { error: { message: 'Data shape unexpected' } }
  }
  const { auth_token, refresh_token } = dataRes.data

  setRefreshCookie(event, config, rememberMe, refresh_token)
  setAuthToken(auth_token)

  return { token: auth_token }
})
