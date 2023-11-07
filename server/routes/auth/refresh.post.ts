import { performRefresh } from '@/server/utils/account'

export default defineEventHandler(async (event) => {
  const refreshData = await performRefresh(event)
  if ('error' in refreshData) {
    setResponseStatus(event, Math.min(400, refreshData.status))
    return refreshData.error
  }

  const config = useRuntimeConfig()

  const { data, rememberMe } = refreshData
  const { auth_token, refresh_token } = data

  setRefreshCookie(event, config, rememberMe, refresh_token)

  return { token: auth_token }
})
