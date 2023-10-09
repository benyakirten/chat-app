import axios from 'axios'

import { getRefreshCookie, setRefreshCookie } from '@/server/utils/cookies'
import { setAuthToken } from '@/server/utils/axios'
import { REFRESH_TOKEN_RESPONSE } from '@/utils/shapes'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const refreshToken = getRefreshCookie(event, config)

  const result = await axios.post('/auth/refresh', {
    token: refreshToken,
  })

  if (result.status > 400) {
    setResponseStatus(event, result.status)
    return result.data
  }

  const dataRes = REFRESH_TOKEN_RESPONSE.safeParse(result.data)
  if (!dataRes.success) {
    setResponseStatus(event, 500)
    return { error: { message: 'Data shape unexpected' } }
  }
  const { auth_token, refresh_token } = dataRes.data

  setRefreshCookie(event, config, refresh_token)
  setAuthToken(auth_token)

  return { token: auth_token }
})
