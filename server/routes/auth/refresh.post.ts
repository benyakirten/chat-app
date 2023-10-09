import axios from 'axios'
import { getRefreshCookie, setRefreshCookie } from '@/server/utils/cookies'
import { REFRESH_TOKEN_RESPONSE } from '@/utils/api/shapes'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { rememberMe, refreshToken } = getRefreshCookie(event, config)

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

  setRefreshCookie(event, config, rememberMe, dataRes.data.refresh_token)

  return { token: dataRes.data.auth_token }
})
