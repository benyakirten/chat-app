export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event) as { private: string }
  const res = await sendAuthedRequest(event, 'get', `/api/conversations/private/${queryParams.private}`)

  setResponseStatus(event, res.status)
  return res.data
})
