import { performRefresh, setAuthData } from '@/server/utils/account'

export default defineEventHandler(async (event) => {
  const refreshData = await performRefresh(event)
  if ('error' in refreshData) {
    setResponseStatus(event, Math.min(400, refreshData.status))
    return refreshData.error
  }

  const { data, rememberMe } = refreshData

  return setAuthData(event, data, rememberMe)
})
