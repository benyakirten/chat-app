import { URLSearchParams } from 'url'

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event) as { page_token: string; search: string }
  const query = new URLSearchParams(queryParams)

  const res = await sendAuthedRequest(event, 'get', `/api/users?${query}`)

  setResponseStatus(event, res.status)
  return res.data
})
